// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: Downloader.js
// Time-stamp: <2018-06-22 16:33:57 (zinn)>
// -------------------------------------------

import Request from 'superagent';
import binaryParser from 'superagent-binary-parser';

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
		    console.log('Downloader/downloadFile Success Case: ', that.url, res);
		    resolve(res);
		}
	    })});
    }

    // See https://visionmedia.github.io/superagent/#binary
    downloadBlob() {
	var that = this;
	return new Promise(function(resolve, reject) {
	    Request
	    	.get(that.url)
		.responseType('blob') // crucial to download binary files as well (!)
                .end((err, res) => {
		if (err) {
		    console.log('Downloader/downloadBlob Error Case: ', that.url, err);
		    reject(err);
		} else {
		    console.log('Downloader/downloadBlob Success Case: ', that.url, res);
		    resolve(res);
		}
	    })});
    }
    
    // todo: test whether this works for other mimetypes
    downloadBinaryFile() {
	var that = this;
	return new Promise(function(resolve, reject) {
	    Request
		.get(that.url)
		.parse(binaryParser)
		.buffer()
		.end((err, res)=>{
		    if (err) {
			console.log('Downloader/downloadFile Error Case: ', that.url, err);
			reject(err);
		    } else {
			console.log('Downloader/downloadFile Success Case: ', that.url, res);
			resolve(res)
		    }})})
    };
}
