import React from 'react';
import Loader from 'react-loader';
import Dropzone from 'react-dropzone';
import ResourceActions from '../actions/ResourceActions';
import TextareaAutosize from 'react-autosize-textarea';
// import LinkArea from './LinkArea';

// access to profiler
import Profiler from '../back-end/Profiler';
import Uploader from '../back-end/Uploader';
import Downloader from '../back-end/Downloader';
import {urlPath,fileStorage} from '../back-end/util';

export default class DropArea extends React.Component {
    constructor(props) {
	super(props);

	this.showFiles   = this.showFiles.bind(this);
	this.onDrop      = this.onDrop.bind(this);
	
	this.state = {
	    loaded: true,	    
	    files: [],
	    url: ''
	};
	
	this.handlePaste    = this.handlePaste.bind(this);	
	this.handleChange   = this.handleChange.bind(this);
	this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleChange(event) {
	//console.log('A change took place.', event.target.value);
	this.handlePaste(event);
	// event.preventDefault();
    }

    handleKeyPress(event) {    
	console.log('A key has been pressed', event.target.value);
	return false;
	
	// Enumerate all supported clipboard, undo and redo keys
	var clipboardKeys = {
		winInsert : 45,
		winDelete : 46,
		SelectAll : 97,
		macCopy : 99,
		macPaste : 118,
		macCut : 120,
		redo : 121,	
		undo : 122
	}
	// Simulate readonly but allow all clipboard, undo and redo action keys
	var charCode = event.which;

	// Accept ctrl+v, ctrl+c, ctrl+z, ctrl+insert, shift+insert, shift+del and ctrl+a
	if (
		event.ctrlKey && charCode == clipboardKeys.redo ||		/* ctrl+y redo			*/
		event.ctrlKey && charCode == clipboardKeys.undo ||		/* ctrl+z undo			*/
		event.ctrlKey && charCode == clipboardKeys.macCut ||		/* ctrl+x mac cut		*/
		event.ctrlKey && charCode == clipboardKeys.macPaste ||		/* ctrl+v mac paste		*/
		event.ctrlKey && charCode == clipboardKeys.macCopy ||		/* ctrl+c mac copy		*/ 
		event.shiftKey && event.keyCode == clipboardKeys.winInsert ||	/* shift+ins windows paste	*/ 
		event.shiftKey && event.keyCode == clipboardKeys.winDelete ||	/* shift+del windows cut	*/ 
		event.ctrlKey && event.keyCode == clipboardKeys.winInsert  ||	/* ctrl+ins windows copy	*/ 
		event.ctrlKey && charCode == clipboardKeys.SelectAll		/* ctrl+a select all		*/
		){ return 0; }
	// Shun all remaining keys simulating readonly textbox
	var theEvent = event || window.event;
	var key = theEvent.keyCode || theEvent.which;
	key = String.fromCharCode(key);
	var regex = /[]|\./;
	if(!regex.test(key)) {
		theEvent.returnValue = false;
		theEvent.preventDefault();
	}
    }

    showFiles() {

        var files = this.state.files;
        if (files.length <= 0) {
            return '';
        }

	// don't duplicate file information (apart from the preview)
	return '';

        // return React.createElement(
        //     'div',
        //     null,
        //     React.createElement(
        //         'h2',
	// 	{ className: 'resource' },		
        //         'Dropped file(s): '
        //     ),
        //     React.createElement(
        //         'ul',
	// 	{ className: 'resource' },		
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

    downloadAndProcessFile( link ) {

	// local b2drop instance
	// https://weblicht.sfs.uni-tuebingen.de/owncloud/index.php/s/B5nlhfHbPiac3OF/download
	var corsLink = "";
	if ( link.indexOf("https://www.dropbox.com") !== -1 ) {
	    corsLink = link.replace('https://www.dropbox.com', '/www-dropbox-com');
	    corsLink = corsLink.replace('?dl=0', '?dl=1');
	} else if ( link.indexOf("https://b2drop.eudat.eu") !== -1 ) {
	    corsLink = link.replace('https://b2drop.eudat.eu', '/b2drop-eudat-eu').concat('/download');
	} else if ( link.indexOf("https://weblicht.sfs.uni-tuebingen.de/nextcloud") !== -1 ) {
	    corsLink = link.replace('https://weblicht.sfs.uni-tuebingen.de/nextcloud', '/weblicht-sfs-nextcloud').concat('/download');
	} else {
	    alert('For the time being, only official dropbox and b2drop account links are being processed. Please check your shared link');
	    return;
	}
	    
	//console.log('window.location.origin', window.location.origin, corsLink);
	var fullCorsLink = window.location.origin.concat('/clrs-dev').concat(corsLink);
	//console.log('window.location.origin full', fullCorsLink);
	let downloader = new Downloader( fullCorsLink );
	this.setState( { loaded: false });
	//console.log('state', this.state);
	let that = this;
	let promiseDownload = downloader.downloadFile();
	
	promiseDownload.then(
	    function(resolve) {
		//console.log('DropArea/downloadAndProcessFile', resolve);
		let file = new File([resolve.text], resolve.req.url, {type: resolve.type});
		//console.log('DropArea/file', file);
		let remoteFileName = '';
		if ( link.indexOf("https://www.dropbox.com") !== -1 ) {
		    remoteFileName = link.replace('?dl=0', '?dl=1');
		} else {
		    remoteFileName = link.concat('/download');
		}
		let profiler = new Profiler( file, "dnd", remoteFileName ); //resolve.req.url
		profiler.convertProcessFile();
		that.setState( { loaded: true });
	    },
	    function(reject) {
		console.log('DropArea.jsx/download failed', reject);
		alert('Error: unable to download file');
		that.setState( { loaded: true });
	    });
    }   

    uploadAndProcessFile( currentFile ) {

	this.setState( { loaded: false });
	let that = this;
	let uploader = new Uploader( currentFile );

	// use environment variable set in webpack config to decide which file storage server to use
	let promiseUpload;
	if (fileStorage === "MPCDF") {
	    promiseUpload = uploader.uploadFile();
	} else {
	    promiseUpload = uploader.uploadFile_NC_B2DROP();
	}
	
	promiseUpload.then(
	    function(resolve) {
		// console.log('DropArea/uploadAndProcessFile', resolve);//
		let profiler = new Profiler( currentFile, "dnd", uploader.remoteFilename );
		profiler.convertProcessFile();
		that.setState( { loaded: true });
		//profiler.convertFileToPlainText();
	    },
	    function(reject) {
		console.log('DropArea.jsx/upload failed', reject);
		alert('Error: unable to upload file');
		that.setState( { loaded: true });		
	    });
    }   
    
    onDrop(files) {

	// clear resources view
	if (files.length > 0) {
	    ResourceActions.reset();
	}	

	// process the file(s)
	for (var i=0; i<files.length; i++) {
	    this.uploadAndProcessFile( files[i] );	    
	}

	// set the state
	// CZ: check whether no longer needed
	this.setState({
	    files: files
	});
    }

    handlePaste(event) {

	var link = event.target.value;
	if ( /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/.test(link) ) {
	    //console.log('A paste took place.', link);
	    ResourceActions.reset();
	    this.downloadAndProcessFile( link );	    
	    this.setState({
		files: link
	    });
	    event.target.value = "";
	} else {
	    console.log('The paste is not a URL', link);
	}
	// return false; // event.preventDefault();
    }

    render() {
        var style1 = {
            borderWidth: 2,
            borderColor: 'black',
            borderStyle: 'dashed',
            borderRadius: 4,
            margin: 30,
            padding: 30,
            width: 200,
	    resize: 'none',
	    transition: 'all 0.5s',
	    display:'inline-block'
        };

        var style2 = {
            borderWidth: 2,
            borderColor: 'black',
            borderStyle: 'dashed',
            borderRadius: 4,
            margin: 30,
            padding: 30,
            width: 300,
	    resize: 'none',
	    transition: 'all 0.5s',
	    display:'inline-block',
	    position:'relative',
	    top:'65px'
        };
	
        var activeStyle = {
            borderStyle: 'solid',
            backgroundColor: '#eee',
            borderRadius: 8
        };

	if ( urlPath === "/clrs" ) {
	    return (
		<div>
		  <Loader loaded={this.state.loaded} />
		  <Dropzone onDrop={this.onDrop}
	                    style={style1}
			    activeStyle={activeStyle} >
		    Drop your files here, or click here to select files to upload.
		  </Dropzone>
	          {this.showFiles()}
		</div>
	    )
	} else {
	    return (
		<div>
		  <Loader loaded={this.state.loaded} />
		  <Dropzone onDrop={this.onDrop}
	                    style={style1}
			    activeStyle={activeStyle} >
		    Drop your files here, or click here to select files to upload.
		  </Dropzone>
		  <TextareaAutosize rows={6}
				    maxRows={6}
				    style={style2}
				    activeStyle={activeStyle}
	                            onChange={this.handleChange}
	                            onKeyPress={this.handleKeyPress}
				    placeholder='For users of dropbox.com and b2drop.eudat.eu, paste your cloud-based link here. EXPERIMENTAL !' />

		{this.showFiles()}
		</div>
	    )
	}
    }
}
