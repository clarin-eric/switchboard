import Request from 'superagent';
import {processLanguage} from './util';
import ResourceActions from '../actions/ResourceActions';

export default class Profiler {

    constructor( resource, caller, remoteFilename ) {

	this.protocol    = window.location.protocol;	// use https or http given parent window
	// TIKA prefix
	//this.tika = "//weblicht.sfs.uni-tuebingen.de/clrs"
	// this.tika = "//localhost"
	this.tika = window.location.origin;
	this.resource = resource;
	this.remoteFilename = remoteFilename;
	    
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
    }

    // not called (info from browser and VLO is being trusted)
    identifyMimeType( ) {
	let file = this.resourceProps.file;
	let protocol = this.protocol;
	let that = this;	
	return new Promise(function(resolve, reject) {
	    Request
		.put(that.tika.concat('/clrs-dev/detect/stream'))
		.send(file)	
		.set('Content-Type', file.type)	
		.end((err, res) => {
		    if (err) {
			reject(err);
			alert('Warning: could not identify media type.');
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
		.put(that.tika.concat('/clrs-dev/language/string'))
		.send(file)	
		.set('Content-Type', file.type)	
		.end((err, res) => {
		    if (err) {
			reject(err);
			alert('Warning: could not identify language');
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
		.put(that.tika.concat('/clrs-dev/language/string'))
		.send(file)	
		.set('Content-Type', file.type)	
		.end((err, res) => {
		    if (err) {
			reject(err);
			alert('Warning: could not identify language');
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
		.put(that.tika.concat('/clrs-dev/tika'))
		.send(file)	
		.set('Accept', 'text/plain')	
		.end((err, res) => {
		    if (err) {
			reject(err);
			alert('Warning: could not download content');
		    } else {
			console.log('Profiler/getContent', res);
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
		//console.log('convertFileToPlainText/resolve', resolve);
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

    // mimetype detection, and given the media type of the resource is NOT plain/text,
    // but one where TIKA parsers are available use of tika to convert file (for selected file formats)
    convertProcessFile() {
	let that = this;
	let promiseMimeType = that.identifyMimeType();
	promiseMimeType.then(
	    function(resolve) {
		// console.log('mimetype identification succeeded', resolve);
		if ( (resolve.text == "application/pdf") ||
		     (resolve.text == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" )) {
		    let promiseConvert = that.convertToPlainText();
		    promiseConvert.then(
			function(resolve) {
			    let promiseLanguage = that.identifyLanguageFromStream(resolve.text);
			    promiseLanguage.then(
				function(resolve) {
				    //console.log('language identification from stream succeeded', resolve);
				},
				function(reject) {
				    console.log('Warning: language identification from stream failed', reject);
				})},
			function(reject) {
			    console.log('Warning: conversion to plain/text failed', reject) })
		} else {
		    let promiseLanguage = that.identifyLanguage();
		    promiseLanguage.then(
			function(resolve) {
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
