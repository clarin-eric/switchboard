import React from 'react';
import Dropzone from 'react-dropzone';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';
import ToolActions from '../actions/ToolActions';
import Request from 'superagent';
import util from '../libs/util';

export default class DropArea extends React.Component {
    constructor(props) {
	super(props);

	this.addNote     = this.addNote.bind(this);
	
	this.processLanguage = util.processLanguage.bind(this);
	this.showFiles   = this.showFiles.bind(this);
	this.onDrop      = this.onDrop.bind(this);
	
	this.state = {
	    files: []
	};
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
	console.log('showFiles', files);
	
        if (files.length <= 0) {
            return '';
        }

	// don't duplicate file information (apart from the preview)
	return '';

	//disabled
        return React.createElement(
            'div',
            null,
            React.createElement(
                'h2',
		{ className: 'lane' },		
                'Dropped file(s): '
            ),
            React.createElement(
                'ul',
		{ className: 'lane' },		
                [].map.call(files, function (f, i) {
                    return React.createElement(
			'li',
			{
                            key: i 
			},
			React.createElement('img', {
                            src: f.preview,
                            width: 100 
			}),
			React.createElement(
			    'div',
			    null,
			    f.name + ' : ' + f.size + ' bytes.'
			)
                    );
                })
            )
        );
    };

    doRequests( currentFile ) {
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
		    console.log('DropArea: error in uploading resource document to MPG', newFileName, err);
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
    };

    onDrop(files) {

	console.log('onDrop entry, processing these files', files, files.length);
	
	for (var i=0; i<files.length; i++) {
	    this.doRequests( files[i] );
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
