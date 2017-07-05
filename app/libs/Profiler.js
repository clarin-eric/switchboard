import Request from 'superagent';
import {processLanguage} from '../libs/util';
import NoteActions from '../actions/NoteActions';
import ResourceActions from '../actions/ResourceActions';

export default class Profiler {

    constructor( resource ) {

	let today = new Date();
	let fileExtension = resource.name.split('.').pop();

	this.addNote     = this.addNote.bind(this);
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
	
	// default values
	this.resourceProps =
	    { name: resource.name,
	      filename: resource.name,
	      filenameWithDate: today.getTime() + "." + fileExtension,
	      file: resource,
	      upload: 'dnd',
	      mimetype: resource.type, 
	      language: "eng",
	      languageCombo: "English:eng"
	    }

	this.resource = null;
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
    
    uploadFile() {
	let currentFile = this.resourceProps;
	var newFileType = currentFile.type;
	if ( (newFileType == "text/xml") ||
	     (newFileType == "text/folio+xml") || 
	     (newFileType == "") ) {
	    newFileType = "application/octet_stream"
	}

	let newFileName = currentFile.filenameWithDate;
	let protocol = this.protocol;
	let that = this;

	console.log('Profiler/uploadFile', currentFile.file);
        return new Promise(function(resolve, reject) {
	    Request
		.post(protocol.concat('//weblicht.sfs.uni-tuebingen.de/clrs/storage/').concat(newFileName))
		.send(currentFile.file)	
		.set('Content-Type', newFileType)
		.end((err, res) => {
		    if (err) {
			reject(err);
			alert('Error in uploading resource to the MPG temporary file storage server.');
		    } else {
			// when uploaded succeeded, we present resource information
			that.resource = ResourceActions.create( that.resourceProps );
			let resourceId = that.resource.id;
			that.addNote(resourceId, "name:   ".concat(that.resource.file.name));
			that.addNote(resourceId, "type:   ".concat(that.resource.file.type)); // overwritten by Tika, see below
			that.addNote(resourceId, "size:   ".concat(that.resource.file.size));	
			// remaining actions.
			resolve(res)
		    }
		})});
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
			let resourceId = that.resource.id;
			that.addNote(resourceId, "type:   ".concat(that.resourceProps.mimetype)); 
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
			// must be sequenced (CZ, use promises and superagent together)
			that.resourceProps.language = langStructure.threeLetterCode;
			that.resourceProps.languageCombo = langStructure.languageCombo;
			let resourceId = that.resource.id;			
			that.addNote(resourceId, "language:".concat( langStructure.languageCombo ));				
			resolve(res);
		    }
		})
	});
    }

    processFile() {
	let promiseUpload = this.uploadFile();
	let that = this;
	promiseUpload.then(
	    function(resolve) {
		let promiseLanguage = that.identifyLanguage();
		promiseLanguage.then(
		    function(resolve) {
			let promiseMimeType = that.identifyMimeType();
			promiseMimeType.catch(
			    function(reject) {
				console.log('mimetype id failed', reject);
			    })},
		    function(reject) {
			console.log('lang id failed', reject) })},
	    function(reject) {
		console.log('upload failed', reject);
	    })
    }

    processFile_b2Drop() {
	let promiseUpload = this.uploadFile();
	let that = this;
	promiseUpload.then(
	    function(resolve) {
		let promiseGetShares = that.create_b2DropShares();
		promiseGetShares.then(
		    function(resolve) {
			let promiseLanguage = that.identifyLanguage();
			promiseLanguage.then(
			    function(resolve) {
				let promiseMimeType = that.identifyMimeType();
				promiseMimeType.catch(
				    function(reject) {
					console.log('mimetype id failed', reject);
				    })},
			    function(reject) {
				console.log('lang id failed', reject) })},
		    function(reject) {
			console.log('creation of shares failed', reject)})},
	    function(reject) {
		console.log('upload failed', reject);
	    })
    }
	    
    upload_b2Drop() {

	let currentFile = this.resourceProps;
	let newFileName = currentFile.filenameWithDate;
	let protocol = this.protocol;
	let that = this;

	return new Promise(function(resolve, reject) {
	    // 1a. store in local b2drop instance
	    Request
		.put(this.cloudURL.concat('/owncloud/remote.php/webdav/').concat(newFileName))    
		.auth('switchboard', 'clarin-plus')
		.set('Access-Control-Allow-Origin', '*')	
		.set('Access-Control-Allow-Credentials', 'true')
		.set('Content-Type', currentFile.type)
		.withCredentials()    
		.set('Cache-Control', 'no-cache,no-store,must-revalidate,max-age=-1')
		.send(currentFile)
		.end((err, res) => {
		    if (err) {
			reject(err);
			alert('Error in uploading resource to B2Drop instance');
		    } else {
			// 1b. Create a 'share link' action on the file you uploaded
			resolve(res);
		    }
		})
	})
    };

    create_b2DropShares() {
	let currentFile = this.resourceProps;
	let newFileName = currentFile.filenameWithDate;
	let protocol = this.protocol;
	let that = this;
	
	return new Promise(function(resolve, reject) {	
	    Request
		.post(this.cloudURL.concat('/owncloud/ocs/v1.php/apps/files_sharing/api/v1/shares'))
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/xml')
		.set('Access-Control-Allow-Origin', '*')
		.set('Access-Control-Allow-Credentials', 'true')
		.send( { path : newFileName,
			 shareType: 3
		       } )
		.auth('switchboard', 'clarin-plus')
		.withCredentials()
		.end((err, res) => {
		    if (err) {
			reject(err);			
			alert('Error in creating a share-link with B2Drop'.concat(newFileName));
		    } else {
			var parseString = require('xml2js').parseString;
			parseString(res.text, function (err, result) {
			    console.log('sharing result', result, err);
			    console.log('url to download', result.ocs.data[0].url[0].concat('/download'));
			});
			resolve(res)
		    }})
	})
    }


    // same version with nesting
    processFile_nested() {

	let resource = ResourceActions.create( this.resourceProps );
	let resourceId = resource.id;

	// information known from file drop
	this.addNote(resourceId, "name:   ".concat(resource.file.name));
	this.addNote(resourceId, "type:   ".concat(resource.file.type));
	this.addNote(resourceId, "size:   ".concat(resource.file.size));	
	
	// CZ: RZG file upload server does not handle files of type "text/xml" appropriately.
	// upload works, download only gives metadata of file to be downloaded.
	let currentFile = this.resourceProps.file;
	
	var newFileType = currentFile.type;
	if ( (newFileType == "text/xml") ||
	     (newFileType == "text/folio+xml") || 
	     (newFileType == "") ) {
	    newFileType = "application/octet_stream"
	}

	// use https or http, given CLRS invocation
	let newFileName = this.resourceProps.filenameWithDate;
	
	Request
	    .post(this.protocol.concat('//weblicht.sfs.uni-tuebingen.de/clrs/storage/').concat(newFileName))
	    .send(currentFile)	
	    .set('Content-Type', newFileType)
	    .end((err, res) => {
		if (err) {
		    alert('Error in uploading resource to the MPG temporary file storage server.');
		} else {
		    Request
			.put(this.protocol.concat('//weblicht.sfs.uni-tuebingen.de/clrs/language/string'))
			.send(currentFile)	
			.set('Content-Type', currentFile.type)	
			.end((err, res) => {
			    if (err) {
				alert('Warning: could not identify language');
			    } else {
				console.log('identified language as', res.text);
				let langStructure = processLanguage(res.text);
				this.resourceProps.language = langStructure.threeLetterCode;
				this.resourceProps.languageCombo = langStructure.languageCombo;
				this.addNote(resourceId, "language:".concat( langStructure.languageCombo ));				
				Request
				    .put(this.protocol.concat('//weblicht.sfs.uni-tuebingen.de/clrs/detect/stream'))
				    .send(currentFile)	
				    .set('Content-Type', currentFile.type)	
				    .end((err, res) => {
					if (err) {
					    alert('Warning: Apache Tika could not identify media type.');
					} else {
					    if (this.resourceProps.mimetype == res.type) {
						console.log('Browser-based mimetype detection identical to Apache Tika detection')
					    } else {
						console.log('Browser-based mimetype detection not identical to Apache Tika detection',
							    this.resourceProps.mimetype,
							    res.type);
						this.resourceProps.mimetype = res.text;
						this.updateNote(resourceId, "type:   ".concat(res.type));
					    }
					}
				    })
			    }
			})		    
		}
	    });
    }

    processFile_b2Drop_nested() {
	let resource = ResourceActions.create( this.resourceProps );
	let resourceId = resource.id;

	// information known from file drop
	this.addNote(resourceId, "name:   ".concat(resource.file.name));
	this.addNote(resourceId, "type:   ".concat(resource.file.type));
	this.addNote(resourceId, "size:   ".concat(resource.file.size));	
	
	let currentFile = this.resourceProps.file;
	let newFileName = this.resourceProps.filenameWithDate;

	// 1a. store in local b2drop instance
	Request
	    .put(this.cloudURL.concat('/owncloud/remote.php/webdav/').concat(newFileName))    
            .auth('switchboard', 'clarin-plus')
	    .set('Access-Control-Allow-Origin', 'vpn2183.extern.uni-tuebingen.de')
	    .set('Access-Control-Allow-Credentials', 'true')
            .set('Content-Type', currentFile.type)
	    .withCredentials()    
	    .send(currentFile)
	    .end((err, res) => {
	    if (err) {
		    alert('Error in uploading resource to B2Drop instance');
		    console.log('Error', err, res);
		} else {
		    // 1b. Create a 'share link' action on the file you uploaded
		    Request
			.post(this.cloudURL.concat('/owncloud/ocs/v1.php/apps/files_sharing/api/v1/shares'))
		    	.set('Content-Type', 'application/json')
			.set('Accept', 'application/xml')
		        .set('Access-Control-Allow-Origin', '*')
			.set('Access-Control-Allow-Credentials', 'true')
		        .send( { path : newFileName,
			         shareType: 3
			       } )
			.auth('switchboard', 'clarin-plus')
			.withCredentials()
			.end((err, res) => {
			    if (err) {
				alert('Error in creating a share-link with B2Drop'.concat(newFileName));
			    } else {
				var parseString = require('xml2js').parseString;
				parseString(res.text, function (err, result) {
				    console.log('sharing result', result, err);
				    console.log('url to download', result.ocs.data[0].url[0].concat('/download'));
				});
		    
				// 2. Do mimetype detection using tika (available at detect/stream)
				// ----------------------------------------------------------------
				var mimetypeDetected = "identify mimetype!";	    
				Request
				    .put('http://weblicht.sfs.uni-tuebingen.de/clrs/detect/stream')
				    .send(currentFile)	
				    .set('Content-Type', currentFile.type)
				    .end((err, res) => {
					if (err) {
					    console.log('error: mimetype identification', newFileName, err);
					} else {
					    console.log('success: mimetype identification', newFileName, res.text);
					    mimetypeDetected = res.text;
					    
					    // 3. do language detection using tika (available at language/string)
					    // ------------------------------------------------------------------
					    // tika seems to support at least these 18 languages:
    					    // da, en, hu, no, sv, de, es, is, pl, th, et, fi, it, pt, el, fr, nl, ru
					    // --------------------------------------------------------
					    
					    var languageDetected = "identify language!";
					    Request
						.put('http://weblicht.sfs.uni-tuebingen.de/clrs/language/string')
						.send(currentFile)	
						.set('Content-Type', currentFile.type)	
						.end((err, res) => {
						    if (err) {
							console.log('error: language identification', newFileName, err);
						    } else {
							console.log('success: language identification', newFileName, res.text);
							languageDetected = res.text;
							
							// with all information gathered, define new resource and its properties
							var languageHarmonization = processLanguage(languageDetected);
							this.addNote(resourceId, "language:".concat( languageHarmonization.languageCombo));
						    }})
					}})}
			})}
	    })}
}
