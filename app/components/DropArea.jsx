import React from 'react';
import Dropzone from 'react-dropzone';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';
import ToolActions from '../actions/ToolActions';

import Request from 'superagent';
import util from '../libs/util';

// alternative to superagent

export default class DropArea extends React.Component {
    constructor(props) {
	super(props);

	this.addNote     = this.addNote.bind(this);
	
	this.processLanguage = util.processLanguage.bind(this);
	this.showFiles   = this.showFiles.bind(this);
	this.onDrop      = this.onDrop.bind(this);
	this.owncloud_share = this.owncloud_share.bind(this);
	
	this.state = {
	    files: []
	};

	// SHANNON
	this.cloudURLWithCredentials = "http://switchboard:clarin-plus@shannon.sfs.uni-tuebingen.de";
	this.cloudURL = "http://shannon.sfs.uni-tuebingen.de";

	//LOCALHOST
	// this.cloudURLWithCredentials = "http://switchboard:clarin-plus@localhost";
	//	this.cloudURL = "http://localhost";

	// OFFICIAL SITE
	// this.cloudURL = "https://b2drop.eudat.eu";
	// this.cloudURLWithCredentials = "claus.zinn@uni-tuebingen.de:sPL-Fh2-7SS-hCJ@https://b2drop.eudat.eu";
    }

    // a lane is a list of notes describing the file dropped
    // a note has a back-link to the lane it belongs to, and each lane knows its notes.
    addNote( laneId, description ) {
	const note = NoteActions.create({
	    task: description,
	    belongsTo: laneId});
	
	LaneActions.attachToLane({
	    noteId: note.id,
	    laneId
	});
    }

    showFiles() {

        var files = this.state.files;
//	console.log('showFiles', files);
	
        if (files.length <= 0) {
            return '';
        }

	// don't duplicate file information (apart from the preview)
	return '';

	//disabled
        // return React.createElement(
        //     'div',
        //     null,
        //     React.createElement(
        //         'h2',
	// 	{ className: 'lane' },		
        //         'Dropped file(s): '
        //     ),
        //     React.createElement(
        //         'ul',
	// 	{ className: 'lane' },		
        //         [].map.call(files, function (f, i) {
        //             return React.createElement(
	// 		'li',
	// 		{
        //                     key: i 
	// 		},
	// 		React.createElement('img', {
        //                     src: f.preview,
        //                     width: 100 
	// 		}),
	// 		React.createElement(
	// 		    'div',
	// 		    null,
	// 		    f.name + ' : ' + f.size + ' bytes.'
	// 		)
        //             );
        //         })
        //     )
        // );
    }

    processFile( currentFile ) {
	var today = new Date();
	var newFileName = currentFile.name + '_at_' + today.getTime();
	var fileExtension = currentFile.name.split('.').pop();
	newFileName = today.getTime() + "." + fileExtension;

	// todo: RZG file upload server does not handle files of type "text/xml" appropriately.
	// upload works, download only gives metadata of file to be downloaded.
	var newFileType = currentFile.type
	if ( (newFileType == "text/xml") ||
	     (newFileType == "text/folio+xml") || 
	     (newFileType == "") ) {
	    newFileType = "application/octet_stream"
	}
	
	// 1. store in the temporary file store at the MPG
	// -- the following URL is a proxy to 'http://ws1-clarind.esc.rzg.mpg.de/drop-off/storage/'
	Request
	    .post('http://weblicht.sfs.uni-tuebingen.de/clrs/storage/'.concat(newFileName))
	    .send(currentFile)	
	    .set('Content-Type', newFileType)
	    .end((err, res) => {
		if (err) {
		    alert('Error in uploading resource to the MPG temporary file storage server');
		} else {
		    console.log('DropArea: success in uploading resource document to MPG', newFileName, res);
		    
		    // 2. do mimetype detection using tika (available at detect/stream)
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
				// need to preset the language menu
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

					    // with all information gathered, define new lane (i.e. resource and its properties)
					    var languageHarmonization = this.processLanguage(languageDetected);

					    var lane = LaneActions.create( { name: currentFile.name,
									     filename: currentFile.name,
									     filenameWithDate: newFileName,
									     file: currentFile,
									     upload: 'dnd',
									     mimetype: currentFile.type,
									     language: languageHarmonization.threeLetterCode
									   } );

					    var laneId = lane.id;
					    
					    this.addNote(laneId, "name:   ".concat(currentFile.name));
					    this.addNote(laneId, "type:   ".concat(currentFile.type));
					    this.addNote(laneId, "size:   ".concat(currentFile.size));	
					    this.addNote(laneId, "language:".concat( languageHarmonization.languageCombo));
					}
				    })
			    }
			})
		}
	    });
    }

    owncloud_upload( newFileName, currentFile ) {

	var that = this;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange=function(){
	    if(xhr.readyState==4 && xhr.status==200){
		consolelog(xhr.responseText);
	    }
	}
	xhr.open('PUT', this.cloudURL.concat('/owncloud/remote.php/webdav/').concat(newFileName), true); //, "switchboard", "clarin-plus");	
	//xhr.open('PUT', this.cloudURL.concat('/remote.php/webdav/').concat(newFileName), true); //, "switchboard", "clarin-plus");
	xhr.setRequestHeader("Authorization", "Basic " + btoa("claus.zinn@uni-tuebingen.de" + ":" + "sPL-Fh2-7SS-hCJ"));
	xhr.setRequestHeader('Content-Type', currentFile.type);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
//        xhr.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type');
        xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
	xhr.withCredentials = true; // for CORS
//	  xhr.setRequestHeader("Authorization", "Basic " + btoa("switchboard" + ":" + "clarin-plus"));
//	  xhr.setRequestHeader('Cache-Control', 'no-cache,no-store,must-revalidate'); // ,max-age=-1
	
	xhr.onload = function() {
	    if (xhr.status >= 200 && xhr.status < 300) {
		console.log('XMLHttpRequest: Success in uploading document', xhr.response, xhr.status);
		that.owncloud_share( newFileName, currentFile );
	    } else {
		console.log('XMLHttpRequest: Error in uploading document!', xhr.response, xhr.status);
	    }
	};
	xhr.send(currentFile);
    }

    owncloud_share( newFileName, currentFile ) {
	var that = this;
	var xhr = new XMLHttpRequest();
//	xhr.withCredentials = true; // for CORS
	xhr.open('POST', that.cloudURL.concat('/owncloud/ocs/v1.php/apps/files_sharing/api/v1/shares'), true); //, "switchboard", "clarin-plus");
//	xhr.open('POST', that.cloudURL.concat('/ocs/v1.php/apps/files_sharing/api/v1/shares'), true); //, "switchboard", "clarin-plus");	
	xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader("Authorization", "Basic " + btoa("claus.zinn@uni-tuebingen.de" + ":" + "sPL-Fh2-7SS-hCJ"));	
//	xhr.setRequestHeader("Authorization", "Basic " + btoa("switchboard" + ":" + "clarin-plus"));	
//	xhr.setRequestHeader('Accept', 'application/xml');
	// xhr.setRequestHeader('Cache-Control', 'no-cache,no-store,must-revalidate'); // ,max-age=-1'
	
	// not working:
	
	// xhr.setDisableHeaderCheck(true);
	// xhr.setRequestHeader('Cookie', "cookie_test=deleted; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/owncloud/ocs/v1.php/apps/files_sharing/api/v1");
	// xhr.setRequestHeader('Cookie', "cookie_test=deleted; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/owncloud/remote.php/webdav");
	// xhr.setRequestHeader('Cookie', "oc_sessionPassphrase=deleted; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/owncloud");
	// xhr.setRequestHeader('Cookie', "ocfxjl76f0c3=deleted; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/owncloud");			

	xhr.onload = function() {
	    if (xhr.status >= 200 && xhr.status < 300) {
		console.log('XMLHttpRequest: successfully shared file', xhr.response, xhr.status);
		that.owncloud_shares( newFileName );
	    } else {
		console.log('XMLHttpRequest: Error in sharing the document document!', xhr.response, xhr.status);
	    }
	};	

	xhr.send(JSON.stringify({path:newFileName, shareType:"3"}));
    }

    
    owncloud_shares( fileName ) {
	var that = this;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', that.cloudURL.concat('/owncloud/ocs/v1.php/apps/files_sharing/api/v1/shares'), true); // , "switchboard", "clarin-plus");
//	xhr.open('GET', that.cloudURL.concat('/ocs/v1.php/apps/files_sharing/api/v1/shares'), true); // , "switchboard", "clarin-plus");	
//	xhr.setRequestHeader("Authorization", "Basic " + btoa("switchboard" + ":" + "clarin-plus"));
	xhr.setRequestHeader("Authorization", "Basic " + btoa("claus.zinn@uni-tuebingen.de" + ":" + "sPL-Fh2-7SS-hCJ"));		
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
	xhr.setRequestHeader('Accept', 'application/xml');
	// xhr.setRequestHeader('Cache-Control', 'no-cache,no-store,must-revalidate'); // ,max-age=-1'

	xhr.onload = function() {
	    if (xhr.status >= 200 && xhr.status < 300) {
		console.log('XMLHttpRequest: successfully requested shares for ', fileName, xhr.response, xhr.status);
	    } else {
		console.log('XMLHttpRequest: Error in requesting shares for!', fileName, xhr.response, xhr.status);
	    }
	};	

	xhr.send(JSON.stringify({path:fileName}));
    }
    
	
processFile_b2Drop( currentFile ) {
	var today = new Date();
	var newFileName = currentFile.name + '_at_' + today.getTime();
	var fileExtension = currentFile.name.split('.').pop();
	newFileName = today.getTime() + "." + fileExtension;

	var newFileType = currentFile.type
	if ( (newFileType == "text/xml") ||
	     (newFileType == "text/folio+xml") || 
	     (newFileType == "") ) {
	    newFileType = "application/octet_stream"
	}

	// 1a. store in local b2drop instance
	Request
//	.put(this.cloudURL.concat('/remote.php/webdav/').concat(newFileName))
	.put(this.cloudURL.concat('/owncloud/remote.php/webdav/').concat(newFileName))    
	//.auth('claus.zinn@uni-tuebingen.de', 'sPL-Fh2-7SS-hCJ')
        .auth('switchboard', 'clarin-plus')
	.set('Access-Control-Allow-Origin', 'vpn2183.extern.uni-tuebingen.de')
	.set('Access-Control-Allow-Credentials', 'true')
        .set('Content-Type', currentFile.type)
	.withCredentials()    
//	.set('Cache-Control', 'no-cache,no-store,must-revalidate,max-age=-1')
	.send(currentFile)
	.end((err, res) => {
	    //res.send(200);
	    //res.status.should.equal(200);
	    //done();
		if (err) {
		    alert('Error in uploading resource to B2Drop instance');
		    console.log('Error', err, res);
		} else {
		    console.log('DropArea: success in uploading resource document to B2Drop', newFileName, res);

		    // 1b. Create a 'share link' action on the file you uploaded
		    Request
			.post(this.cloudURL.concat('/owncloud/ocs/v1.php/apps/files_sharing/api/v1/shares'))
			//.post(this.cloudURL.concat('/ocs/v1.php/apps/files_sharing/api/v1/shares'))		    
		    	// .set('Content-Type', 'application/x-www-form-urlencoded')
		    	.set('Content-Type', 'application/json')
//			.set('Cache-Control', 'no-cache,no-store,must-revalidate,max-age=-1')
			.set('Accept', 'application/xml')
		        .set('Access-Control-Allow-Origin', '*')
			.set('Access-Control-Allow-Credentials', 'true')
		        .send( { path : newFileName,
			         shareType: 3
			       } )
			//.auth('claus.zinn@uni-tuebingen.de', 'sPL-Fh2-7SS-hCJ')
			.auth('switchboard', 'clarin-plus')
			.withCredentials()
			.end((err, res) => {
			    if (err) {
				console.log('error in sharing', newFileName, err, res);
				alert('Error in creating a share-link with B2Drop'.concat(newFileName));
			    } else {
				console.log('DropArea: success in creating share-link with B2Drop', newFileName, res);

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
					    // need to preset the language menu
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
							
							// with all information gathered, define new lane (i.e. resource and its properties)
							var languageHarmonization = this.processLanguage(languageDetected);
							
							var lane = LaneActions.create( { name: currentFile.name,
											 filename: currentFile.name,
											 filenameWithDate: newFileName,
											 file: currentFile,
											 upload: 'dnd',
											 mimetype: currentFile.type,
											 language: languageHarmonization.threeLetterCode
										       } );
							
							var laneId = lane.id;
							
							this.addNote(laneId, "name:   ".concat(currentFile.name));
							this.addNote(laneId, "type:   ".concat(currentFile.type));
							this.addNote(laneId, "size:   ".concat(currentFile.size));	
							this.addNote(laneId, "language:".concat( languageHarmonization.languageCombo));
						    }
						})
					}
				    })
			    }
			})
			       
		}
	    }
		)
}
    
    onDrop(files) {

	// console.log('onDrop entry, processing these files', files, files.length);

	for (var i=0; i<files.length; i++) {
	    // this.processFile_b2Drop( files[i] );
	    this.processFile( files[i] );	    
	}
	
	this.setState({
	    files: files
	});

	// once new file has been dropped, delete history of prior file drops
	if (files.length > 0) {
	    LaneActions.reset();
	    NoteActions.reset();
	    ToolActions.reset();
	}
    }

    render() {
	
        var style = {
            borderWidth: 2,
            borderColor: 'black',
            borderStyle: 'dashed',
            borderRadius: 4,
            margin: 30,
            padding: 30,
            width: 200,
            transition: 'all 0.5s'
        };

        var activeStyle = {
            borderStyle: 'solid',
            backgroundColor: '#eee',
            borderRadius: 8
        };

	return React.createElement(
            'div',
            null,
            React.createElement(
		Dropzone,
		{
		    onDrop: this.onDrop,
		    style: style,
		    activeStyle: activeStyle 
		},
		'Drop your files here, or click here to select files to upload.'
            ),
	    this.showFiles()
        );
    }
}
