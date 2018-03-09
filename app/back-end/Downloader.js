// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: Downloader.js
// Time-stamp: <2018-03-09 09:52:48 (zinn)>
// -------------------------------------------

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
		    console.log('Downloader/downloadFile Error Case: ', that.url, err);
		    reject(err);
		} else {
		    console.log('Downloader/downloadFile: ', that.url, res);
		    resolve(res);
		}
	    })});
    }
}
