// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: Profiler.js
// Time-stamp: <2019-01-14 11:52:32 (zinn)>
// -------------------------------------------

import Request from 'superagent';
import {appContextPath, processLanguage} from './util';
import ResourceActions from '../actions/ResourceActions';

export default class Profiler {

    constructor( resource, caller, remoteFilename, cb ) {

	this.protocol    = window.location.protocol;	// use https or http given parent window
	this.resource = resource;
	this.remoteFilename = remoteFilename;
	this.cb = cb;
	
	this.windowAppContextPath = window.APP_CONTEXT_PATH;
	// default values
	this.resourceProps =
	    { name: resource.name,
	      remoteFilename: remoteFilename,
	      file: resource,
	      size: resource.size,
	      upload: caller, 
	      
	      // next two pieces are overwritten by Tika.
	      mimetype: resource.type, 
	      language: { language  : "Please identify language",
			  threeLetterCode: "any"
			}
	    }

	// create the resource in the store
	this.resourceStateItem = ResourceActions.create( this.resourceProps );
	console.log('Profiler/constructor', this.resourceProps);
    }

    identifyMimeType( ) {
	let file = this.resourceProps.file;
	let protocol = this.protocol;
	let that = this;	
	return new Promise(function(resolve, reject) {
	    Request
		.put(that.windowAppContextPath + '/detect/stream')
		.send(file)	
		.set('Content-Type', file.type)	
		.end((err, res) => {
		    if (err) {
			reject(err);
			that.cb();		    
		    } else {
			that.resourceStateItem.mimetype = res.text;
			ResourceActions.update(that.resourceStateItem);			
			resolve(res);
		    }
		})
	})
    };

    

    // Apache Tika seems to support at least these 18 languages:
    // da, en, hu, no, sv, de, es, is, pl, th, et, fi, it, pt, el, fr, nl, ru
    identifyLanguage() {
	let file = this.resourceProps.file;
	let protocol = this.protocol;
	let that = this;
	return new Promise(function(resolve, reject) {
	    Request
		.put(that.windowAppContextPath + '/language/string')
		.send(file)	
		.set('Content-Type', file.type)	
		.end((err, res) => {
		    if (err) {
			reject(err);
			that.cb();		    
		    } else {
			let langStructure = processLanguage(res.text);
			that.resourceStateItem.language = langStructure;
			ResourceActions.update(that.resourceStateItem);
			resolve(res);
		    }
		})
	});
    }

    identifyLanguageFromStream( textStream ) {
	let file = new File([textStream], this.resourceProps.name.concat(".txt"), {type: "text/plain"});    	
	let protocol = this.protocol;
	let that = this;
	return new Promise(function(resolve, reject) {
	    Request
		.put(that.windowAppContextPath + '/language/string')
		.send(file)	
		.set('Content-Type', file.type)	
		.end((err, res) => {
		    if (err) {
			reject(err);
			that.cb();		    
		    } else {
			let langStructure = processLanguage(res.text);
			that.resourceStateItem.language = langStructure;
			ResourceActions.update(that.resourceStateItem);
			resolve(res);
		    }
		})
	});
    }
	
    convertToPlainText() {
	let file = this.resourceProps.file;
	let protocol = this.protocol;
	let that = this;
	return new Promise(function(resolve, reject) {
	    Request
		.put(that.windowAppContextPath + '/tika')
		.send(file)	
//		.set('Accept', 'text/plain')	
		.end((err, res) => {
		    if (err) {
			reject(err);
			that.cb();		    			
		    } else {
			console.log('Profiler/getContent', res, file);
			resolve(res);
		    }
		})
	});
    }

    convertFileToPlainText() {
	let that = this;
	let promiseConvert = that.convertToPlainText();
	promiseConvert.then(
	    function(resolve) {
		console.log('convertFileToPlainText/resolve', resolve);
	    },
	    function(reject) {
		console.log('convertFileToPlainText/reject', reject);
	    });
    }

    // mimetype detection and language detection
    simpleProcessFile() {
	let that = this;
	let promiseLanguage = that.identifyLanguage();
	promiseLanguage.then(
	    function(resolve) {
		let promiseMimeType = that.identifyMimeType();
		promiseMimeType.catch(
		    function(reject) {
			console.log('Warning: mimetype identification failed', reject);
		    })},
	    function(reject) {
		console.log('Warning: language identification failed', reject) })
    }

    // mimetype detection, given the media type of the resource is NOT plain/text, requires conversion to text/plain
    convertProcessFile( signalDone ) {
	let that = this;
	let promiseMimeType = that.identifyMimeType();
	promiseMimeType.then(
	    function(resolve) {
		if ( (resolve.text == "application/pdf") ||
		     (resolve.text == "application/rtf") ||		     
		     (resolve.text == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" )) {
		    let promiseConvert = that.convertToPlainText();
		    promiseConvert.then(
			function(resolve) {
			    let promiseLanguage = that.identifyLanguageFromStream(resolve.text);
			    promiseLanguage.then(
				function(resolve) {
				    console.log('language identification from stream succeeded', resolve);
				    signalDone();
				},
				function(reject) {
				    console.log('Warning: language identification from stream failed', reject);
				})},
			function(reject) {
			    console.log('Warning: conversion to plain/text failed', reject) })
		} else if ( (resolve.text == "application/zip") ||
			    (resolve.text == "application/x-gzip") ) {
		    // to do: acknowledge that a zip file has been received, but that a manual identification
		    //        of its parts wrt. language should be made by the user.
		    signalDone();
		    that.cb();
		} else if ( (resolve.text == "audio/vnd.wave") ||
			    (resolve.text == "audio/x-wav")    ||
			    (resolve.text == "audio/wav")      ||
			    (resolve.text == "audio/mp3")      ||			    
			    (resolve.text == "audio/mp4")      ||
			    (resolve.text == "audio/x-mpeg")) {
		    that.cb();		    
		} else {
		    let promiseLanguage = that.identifyLanguage();
		    promiseLanguage.then(
			function(resolve) {
			    signalDone();
			    //console.log('language identification from file succeeded', resolve);
			},
			function(reject) {
			    console.log('Warning: language identification from file failed', reject);
			})}
	    },
	    function(reject) {
		console.log('mimetype identification failed', reject);		
	    })
    }
}
