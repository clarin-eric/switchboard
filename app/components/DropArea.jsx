import React from 'react';
import Dropzone from 'react-dropzone';
import NoteActions from '../actions/NoteActions';
import ResourceActions from '../actions/ResourceActions';

// access to profiler
import Profiler from '../back-end/Profiler';
import Uploader from '../back-end/Uploader';

export default class DropArea extends React.Component {
    constructor(props) {
	super(props);

	this.showFiles   = this.showFiles.bind(this);
	this.onDrop      = this.onDrop.bind(this);
	
	this.state = {
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
	let promiseUpload = uploader.uploadFile();
	promiseUpload.then(
	    function(resolve) {
		let profiler = new Profiler( currentFile, "dnd", uploader.filenameWithDate );
		profiler.processFile( currentFile );
	    },
	    function(reject) {
		alert('Error: unable to upload file');
	    });
    }    
    
    onDrop(files) {

	// clear resources view
	if (files.length > 0) {
	    ResourceActions.reset();
	    NoteActions.reset();
	}	

	// process the file(s)
	for (var i=0; i<files.length; i++) {
	    // this.processFile_b2Drop( files[i] );
	    this.uploadAndProcessFile( files[i] );	    
	}

	// set the state
	// CZ: check whether no longer needed?
	this.setState({
	    files: files
	});
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
