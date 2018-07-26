// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: MatcherRemote.js
// Time-stamp: <2018-07-26 10:53:27 (zinn)>
// -------------------------------------------

import Request from 'superagent';
import binaryParser from 'superagent-binary-parser';
import {matcherURL} from './util';

export default class MatcherRemote {

    constructor( includeWebServices ) {
	this.includeWebServices = includeWebServices;
	this.windowAppContextPath = window.APP_CONTEXT_PATH;
    }

    getAllTools() {
	const includeWS = (this.includeWebServices ? "yes" : "no");
	const that = this;
	return new Promise(function(resolve, reject) {
	    Request
		.get(that.windowAppContextPath+matcherURL
		     + '/api/tools?includeWS='+includeWS
		     + '&sortBy=tasks')
		.set('Accept', 'application/json')
                .end((err, res) => {
		if (err) {
		    console.log('MatcherRemote/getAllTools failed: ', err);
		    reject(err);
		} else {
		    resolve(res.body);
		}
		})});
    }

    getApplicableTools(mimetype, language) {
	const includeWS = (this.includeWebServices ? "yes" : "no");
	const that = this;	
	return new Promise(function(resolve, reject) {
	    Request
		.get(that.windowAppContextPath+matcherURL
		     + '/api/tools?includeWS='+includeWS
		     + '&language=' + language
		     + '&mimetype=' + mimetype
		     + '&sortBy=tasks')
		.set('Accept', 'application/json')	    
                .end((err, res) => {
		if (err) {
		    console.log('MatcherRemote/getApplicableTools failed: ', err);
		    reject(err);
		} else {
		    resolve(res.body);
		}
		})});
    }
}


