// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: Uploader.js
// Time-stamp: <2019-01-22 09:06:20 (zinn)>
// -------------------------------------------

/* Uploads a file to the MPG server in Garching, or to a Nextcloud instance.
 
   - Note that, for instance, the URL '/storage/' is reverse-proxied to

       //ws1-clarind.esc.rzg.mpg.de/drop-off/storage/                      

   The use of the MPG server in Garching is deprecated due to privacy concerns (all can download uploads from there)

   See docker/nginx.conf

*/

import Request from 'superagent';
import {appContextPath,
	fileStorage,
	fileStorageServerMPG_localhost,
	fileStorageServerMPG_remote,
	fileStorageServerNEXTCLOUD_localhost,
	fileExtensionChooser,
	nextcloud_user,
	nextcloud_pass} from './util';

export default class Uploader {

    constructor( { file, type = 'file' } = {})  {
	this.file = file;
	this.windowAppContextPath = window.APP_CONTEXT_PATH;

	const today = new Date();

	if (type == 'file') {
	    this.filenameWithDate = today.getTime() + "." + fileExtensionChooser(file.type);
	} else { // type = blob (taken to be typed text)
	    this.filenameWithDate = today.getTime() + ".txt";
	    if (file.name == undefined) {file.name = this.filenameWithDate}
	}
    }

    uploadFile() {
	if (fileStorage === "MPCDF") {
	    return this.uploadFile_MPCDF();
	} else {
	    return this.uploadFile_NC();
	}
    }

    uploadFile_MPCDF() {
	this.remoteFilename = fileStorageServerMPG_remote + this.filenameWithDate;
	// the file server at the MPG seems to have problems with certain file types, so we change it here.
	this.newFileType = this.file.type;
	if ( (this.newFileType == "text/xml") ||
	     (this.newFileType == "text/folio+xml") || 
	     (this.newFileType == "") ) {
	    this.newFileType = "application/octet_stream"
	}
	
        this.remoteFilenameReverseProxy = this.windowAppContextPath
	    + fileStorageServerMPG_localhost 
	    + this.filenameWithDate;

	let that = this;
	
        return new Promise(function(resolve, reject) {
	    console.log('uploadFile', that.remoteFilenameReverseProxy);
	    Request
		.post(that.remoteFilenameReverseProxy)
		.send(that.file)	
		.set('Content-Type', that.newFileType)
		.end((err, res) => {
		    if (err) {
			console.log('Error in uploading resource to the MPG temporary file storage server.');
			reject(err);
		    } else {
			resolve(res)
		    }
		})});
    }

    // uploading to Nextcloud is a two stage process
    uploadFile_NC() {
	let that = this;
	let cloudPath = this.windowAppContextPath + fileStorageServerNEXTCLOUD_localhost
	
	return new Promise(function(resolve, reject) {
	    // 1a. store in NEXTCLOUD 
	    Request
		.put(cloudPath.concat('remote.php/webdav/').concat(that.filenameWithDate))    
		.auth(nextcloud_user, nextcloud_pass)
		.set('Access-Control-Allow-Origin', '*')	
		.set('Access-Control-Allow-Credentials', 'true')
		.set('Content-Type', that.file.type)
		.withCredentials()    
		.set('Cache-Control', 'no-cache,no-store,must-revalidate,max-age=-1')
		.send(that.file)
		.end((err, res) => {
		    if (err) {
			reject(err);
			console.log('Error in uploading resource to Nextcloud instance');
		    } else {
			// 1b. Create a 'share link' action on the file you uploaded
			Request
			    .post(cloudPath.concat('ocs/v1.php/apps/files_sharing/api/v1/shares'))
			    .set('Content-Type', 'application/json')
			    .set('Accept', 'application/xml')
			    .set('Access-Control-Allow-Origin', '*')
			    .set('Access-Control-Allow-Credentials', 'true')
			    .set('OCS-APIRequest',  'true') // nextcloud v11+
			    .send( { path : that.filenameWithDate,
				     shareType: 3
				   } )
			    .auth(nextcloud_user, nextcloud_pass)			
			    .withCredentials()
			    .end((err, res) => {
				if (err) {
				    reject(err);			
				    console.log('Error in creating a share-link with Nextcloud'.concat(that.filenameWithDate));
				} else {
				    var parseString = require('xml2js').parseString;
				    parseString(res.text, function (err, result) {
					that.remoteFilename = result.ocs.data[0].url[0].concat('/download')
					// hack as shared link returned by nextcloud has wrong protocol (!)
					that.remoteFilename = that.remoteFilename.replace('http', 'https');
					console.log('Uploader/shared link', that.remoteFilename);
				    });
				    resolve(res)
				}})
		    }
		})})
    }
}



