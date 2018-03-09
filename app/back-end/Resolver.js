// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: Resolver.js
// Time-stamp: <2018-03-09 09:53:53 (zinn)>
// -------------------------------------------

import Request from 'superagent';

/* This is an attempt to resolve the handle by checking http code 302/303, 
   but it seems that superagent is automatically following redirects, even if
   .redirect(0) is supplied. The catch does not catch, all I get is an error message in 
   the browser debugger. The python script is now used to download the handle  */
export default class Resolver {
    constructor( url ) {
	url = url.replace('https://hdl.handle.net', '/hdl-handle-net'); // for nginx.
	url = window.location.origin.concat(url);		
	this.url = url;
    }

    resolveHandle() {
	var that = this;
	return new Promise(function(resolve, reject) {
	    Request
		.get(that.url)
                .then((res) => {
		    resolve(res);
		})
		.catch((error) => {
		    console.log('ERROR', error);
		    reject(error)})});
    }
}