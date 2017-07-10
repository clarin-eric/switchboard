// Uploads a file to the MPG server in Garching.
// Note that the URL '//weblicht.sfs.uni-tuebingen.de/clrs/storage/' is reverse-proxied to
// http://ws1-clarind.esc.rzg.mpg.de/drop-off/storage/.

import Request from 'superagent';
import {fileStorageServerMPG, fileStorageServerB2DROP} from './util';

export default class Uploader {

    constructor( file ) {
	this.file = file;
	this.protocol = window.location.protocol;
	let today = new Date();
	let fileExtension = this.file.name.split('.').pop();
	let filenameWithDate = today.getTime() + "." + fileExtension;

	this.remoteFilename = fileStorageServerMPG + filenameWithDate;

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
	    Request
		.post(that.protocol.concat(fileStorageServerMPG).concat(that.filenameWithDate))
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

    // uploading to B2DROP is a two stage process
    uploadFile_B2DROP() {
	let that = this;
	return new Promise(function(resolve, reject) {
	    // 1a. store in B2DROP 
	    Request
		.put(fileStorageServerB2DROP.concat('/remote.php/webdav/').concat(that.filenameWithDate))    
		.auth('switchboard', 'clarin-plus')
		.set('Access-Control-Allow-Origin', '*')	
		.set('Access-Control-Allow-Credentials', 'true')
		.set('Content-Type', that.file.type)
		.withCredentials()    
		.set('Cache-Control', 'no-cache,no-store,must-revalidate,max-age=-1')
		.send(that.file)
		.end((err, res) => {
		    if (err) {
			reject(err);
			alert('Error in uploading resource to B2Drop instance');
		    } else {
			// 1b. Create a 'share link' action on the file you uploaded
			Request
			    .post(fileStorageServerB2DROP.concat('/ocs/v1.php/apps/files_sharing/api/v1/shares'))
			    .set('Content-Type', 'application/json')
			    .set('Accept', 'application/xml')
			    .set('Access-Control-Allow-Origin', '*')
			    .set('Access-Control-Allow-Credentials', 'true')
			    .send( { path : that.filenameWithDate,
				     shareType: 3
				   } )
			    .auth('switchboard', 'clarin-plus')
			    .withCredentials()
			    .end((err, res) => {
				if (err) {
				    reject(err);			
				    alert('Error in creating a share-link with B2Drop'.concat(that.filenameWithDate));
				} else {
				    var parseString = require('xml2js').parseString;
				    parseString(res.text, function (err, result) {
					console.log('sharing result', result, err);
					console.log('url to download', result.ocs.data[0].url[0].concat('/download'));
				    });
				    resolve(res)
				}})
		    }
		})})
    }
}



