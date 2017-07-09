import Request from 'superagent';
import {processLanguage} from './util';
import ResourceActions from '../actions/ResourceActions';

export default class Profiler {

    constructor( resource, caller, filenameWithDate ) {

	this.protocol    = window.location.protocol;	// use https or http given parent window

	// TIKA prefix
	this.tika = "//weblicht.sfs.uni-tuebingen.de/clrs"
	this.resource = resource;

	if (filenameWithDate === undefined) {
	    let today = new Date();
	    let numberSlashes = resource.name.split("/");
	    this.filenameWithDate = resource.name;
	    var fileExtension = "";
	    if (numberSlashes.length == 1) {
		fileExtension = resource.name.slice((Math.max(0, resource.name.lastIndexOf(".")) || Infinity) + 1);
		filenameWithDate = today.getTime() + "." + fileExtension;
	    }
	} else {
	    this.filenameWithDate = filenameWithDate
	}
	    
	// default values
	this.resourceProps =
	    { filename: resource.name,
	      filenameWithDate: filenameWithDate,
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
		.put(protocol.concat(that.tika.concat('/detect/stream')))
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
		.put(protocol.concat(that.tika.concat('/language/string')))
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

    processFile() {
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
}
