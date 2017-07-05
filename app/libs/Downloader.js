import Request from 'superagent';

export default class Downloader {

    constructor( url ) {
	this.url = url;
    }

    downloadFile() {
	var that = this;
	return new Promise(function(resolve, reject) {
	    Request
	    .get(that.url)	
	    .end((err, res) => {
		if (err) {
		    console.log('Downloader/downloadFile: ', err);
		    reject(err);
		} else {
		    console.log('Downloader/downloadFile: ', res, res.header['content-type'], res.header['content-length']);
		    resolve(res);
		}
	    })});
    }
}
