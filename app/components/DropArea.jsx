import React from 'react';
import Loader from 'react-loader';
import Dropzone from 'react-dropzone';
import ResourceActions from '../actions/ResourceActions';


// access to profiler
import Profiler from '../back-end/Profiler';
import Uploader from '../back-end/Uploader';
import {fileStorage} from '../back-end/util';

export default class DropArea extends React.Component {
    constructor(props) {
	super(props);

	this.showFiles   = this.showFiles.bind(this);
	this.onDrop      = this.onDrop.bind(this);
	
	this.state = {
	    isLoaded: true,	    
	    files: []
	};
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

    uploadAndProcessFile( currentFile ) {

	let uploader = new Uploader( currentFile );
	this.setState( { isLoaded: false });
	let that = this;

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
		that.setState( { isLoaded: true });		
		//profiler.convertFileToPlainText();
	    },
	    function(reject) {
		console.log('DropArea.jsx/upload failed', reject);
		alert('Error: unable to upload file');
		that.setState( { isLoaded: true });		
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
	// CZ: check whether no longer needed?
	this.setState({
	    files: files
	});
    }

    render() {

	const { isLoaded } = this.state;	
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
	    Loader,
	    { loaded: isLoaded },
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
