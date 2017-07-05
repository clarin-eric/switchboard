// Uploads a file to the MPG server in Garching.
// Note that the URL '//weblicht.sfs.uni-tuebingen.de/clrs/storage/' is reverse-proxied to
// http://ws1-clarind.esc.rzg.mpg.de/drop-off/storage/.

import Request from 'superagent';

export default class Uploader {

    constructor( file ) {
	this.file = file;
	this.protocol = window.location.protocol;
	let today = new Date();
	let fileExtension = this.file.name.split('.').pop();
	this.filenameWithDate = today.getTime() + "." + fileExtension;

	// the file server at the MPG seems to have problems with certain file types, so we change it here.
	this.newFileType = this.file.type;
	if ( (this.newFileType == "text/xml") ||
	     (this.newFileType == "text/folio+xml") || 
	     (this.newFileType == "") ) {
	    this.newFileType = "application/octet_stream"
	}
	
	console.log('Uploader/constructor', this.file, this.file.name);
    }

    uploadFile() {
	let that = this;
        return new Promise(function(resolve, reject) {
	    Request
		.post(that.protocol.concat('//weblicht.sfs.uni-tuebingen.de/clrs/storage/').concat(that.filenameWithDate))
		.send(that.file.file)	
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
}


