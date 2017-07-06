import Request from 'superagent';
import {processLanguage} from '../libs/util';
import NoteActions from '../actions/NoteActions';
import ResourceActions from '../actions/ResourceActions';

export default class Profiler {

    constructor( resource, caller, filenameWithDate ) {

	this.addNote     = this.addNote.bind(this);
	this.updateNote  = this.updateNote.bind(this);	
	this.protocol    = window.location.protocol;	// use https or http given parent window
	
	// SHANNON
	this.cloudURLWithCredentials = "http://switchboard:clarin-plus@shannon.sfs.uni-tuebingen.de";
	this.cloudURL = "http://shannon.sfs.uni-tuebingen.de";

	//LOCALHOST
	// this.cloudURLWithCredentials = "http://switchboard:clarin-plus@localhost";
	// this.cloudURL = "http://localhost";

	// OFFICIAL SITE
	// this.cloudURL = "https://b2drop.eudat.eu";
	// this.cloudURLWithCredentials = "claus.zinn@uni-tuebingen.de:sPL-Fh2-7SS-hCJ@https://b2drop.eudat.eu";	

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
	    console.log('Profiler/constructor', resource, fileExtension, filenameWithDate,
			numberSlashes, numberSlashes.length, numberSlashes.length == 1);	    
	    
	} else {
	    console.log('Profiler/constructor called with 3 args', resource, filenameWithDate);	    	    
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
	      language: "any",
	      languageCombo: "Please identify language:any"
	    }

	this.resourceStateItem = ResourceActions.create( this.resourceProps );
	let resourceId = this.resourceStateItem.id;

	// information known from file drop
	this.addNote(resourceId, "name:   ".concat(this.resourceStateItem.file.name));
	this.addNote(resourceId, "type:   ".concat(this.resourceStateItem.file.type)); 
	this.addNote(resourceId, "size:   ".concat(this.resourceStateItem.file.size));	
    }

    // a resource is a list of notes describing the file dropped
    // a note has a back-link to the resource it belongs to, and each resource knows its notes.
    addNote( resourceId, description ) {
	const note = NoteActions.create({
	    task: description,
	    belongsTo: resourceId});
	
	ResourceActions.attachToResource({
	    noteId: note.id,
	    resourceId
	});
    }

    updateNote( resourceId, description ) {
	 NoteActions.update({
	    task: description,
	    belongsTo: resourceId});
    }

    // not called (info from browser and VLO is being trusted)
    identifyMimeType( ) {
	let file = this.resourceProps.file;
	let protocol = this.protocol;
	let that = this;	
	return new Promise(function(resolve, reject) {
	    Request
		.put(protocol.concat('//weblicht.sfs.uni-tuebingen.de/clrs/detect/stream'))
		.send(file)	
		.set('Content-Type', file.type)	
		.end((err, res) => {
		    if (err) {
			reject(err);
			alert('Warning: could not identify media type.');
		    } else {
			that.resourceProps.mimetype = res.text;
			let resourceId = that.resourceStateItem.id;
			that.updateNote(resourceId, "type:   ".concat(that.resourceProps.mimetype)); 
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
		.put(protocol.concat('//weblicht.sfs.uni-tuebingen.de/clrs/language/string'))
		.send(file)	
		.set('Content-Type', file.type)	
		.end((err, res) => {
		    if (err) {
			reject(err);
			alert('Warning: could not identify language');
		    } else {
			let langStructure = processLanguage(res.text);
			that.resourceProps.language = langStructure.threeLetterCode;
			that.resourceProps.languageCombo = langStructure.languageCombo;
			let resourceId = that.resourceStateItem.id;			
			that.addNote(resourceId, "language:".concat( langStructure.languageCombo ));				
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

    processFile_b2Drop() {
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
