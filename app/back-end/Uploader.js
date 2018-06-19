// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: Uploader.js
// Time-stamp: <2018-06-19 15:56:13 (zinn)>
// -------------------------------------------

/* Uploads a file to the MPG server in Garching, or to a Nextcloud space.
 
   - Note that, for instance, the URL

     /storage/

    is reverse-proxied to

     //ws1-clarind.esc.rzg.mpg.de/drop-off/storage/                      

   The use of the MPG server in Garching is deprecated due to privacy concerns (all can download uploads from there)

*/

import Request from 'superagent';
import {appContextPath,
	fileStorage,
	fileStorageServerMPG_localhost,
	fileStorageServerMPG_remote,
	fileStorageServerNEXTCLOUD_localhost,
	fileStorageServerB2DROP_localhost,
	b2drop_user,
	b2drop_pass} from './util';

export default class Uploader {

    constructor( { file, type = 'file' } = {})  {
	this.file = file;
	this.protocol = window.location.protocol;
	this.windowAppContextPath = window.APP_CONTEXT_PATH;

	let today = new Date();
	if (type == 'file') {
	    // todo: some filenames may come without an extension
	    let fileExtension = this.file.name.split('.').pop();
	    this.filenameWithDate = today.getTime() + "." + fileExtension;
	} else {
	    this.filenameWithDate = today.getTime() + ".txt";
	}

	console.log('new appContextPath', this.windowAppContextPath);
	// default upload (overwritten during sharing, todo: clean-up)
	this.remoteFilename = fileStorageServerMPG_remote + this.filenameWithDate;
        this.remoteFilenameReverseProxy = this.windowAppContextPath
	    + fileStorageServerMPG_localhost
	    + this.filenameWithDate;

	// needs to be deprecated as MPG server is no longer used.
	// the file server at the MPG seems to have problems with certain file types, so we change it here.
	this.newFileType = this.file.type;
	if ( (this.newFileType == "text/xml") ||
	     (this.newFileType == "text/folio+xml") || 
	     (this.newFileType == "") ) {
	    this.newFileType = "application/octet_stream"
	}
    }

    uploadFile() {
	let that = this;
        return new Promise(function(resolve, reject) {
	    // console.log('uploadFile', that.remoteFilenameReverseProxy);
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

    // uploading to Nextcloud or B2DROP is a two stage process
    uploadFile_NC_B2DROP() {
	let that = this;
	let cloudPath;

	if (fileStorage === "NEXTCLOUD") {
	    cloudPath = this.windowAppContextPath + fileStorageServerNEXTCLOUD_localhost
	} else {
	    cloudPath = this.windowAppContextPath + fileStorageServerB2DROP_localhost
	}

	console.log('Uploader/uploadFile_NC_B2DROP cloudPath', cloudPath);
	
	return new Promise(function(resolve, reject) {
	    // 1a. store in B2DROP 
	    Request
		.put(cloudPath.concat('remote.php/webdav/').concat(that.filenameWithDate))    
		.auth(b2drop_user, b2drop_pass)
		.set('Access-Control-Allow-Origin', '*')	
		.set('Access-Control-Allow-Credentials', 'true')
		.set('Content-Type', that.file.type)
		.withCredentials()    
		.set('Cache-Control', 'no-cache,no-store,must-revalidate,max-age=-1')
		.send(that.file)
		.end((err, res) => {
		    if (err) {
			reject(err);
			alert('Error in uploading resource to NC/B2Drop instance');
		    } else {
			// 1b. Create a 'share link' action on the file you uploaded
//			console.log('2nd request', cloudPath.concat('ocs/v1.php/apps/files_sharing/api/v1/shares'));
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
			    .auth(b2drop_user, b2drop_pass)			
			    .withCredentials()
			    .end((err, res) => {
				if (err) {
				    reject(err);			
				    alert('Error in creating a share-link with B2Drop'.concat(that.filenameWithDate));
				} else {
				    var parseString = require('xml2js').parseString;
				    parseString(res.text, function (err, result) {
					console.log('sharing result', result, err);
					that.remoteFilename = result.ocs.data[0].url[0].concat('/download')
					// hack!
					console.log('Uploader/stored before', that.remoteFilename);					
					that.remoteFilename = that.remoteFilename.replace('http', 'https');
					console.log('Uploader/stored after', that.remoteFilename);
				    });
				    resolve(res)
				}})
		    }
		})})
    }
}



