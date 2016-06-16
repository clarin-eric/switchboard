import React from 'react';
import Dropzone from 'react-dropzone';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';
import ToolActions from '../actions/ToolActions';
import Request from 'superagent';

export default class DropArea extends React.Component {
    constructor(props) {
	super(props);

	this.addLane     = this.addLane.bind(this);
	this.addNote     = this.addNote.bind(this);
	this.addFilename = this.addFilename.bind(this);
	this.addFile     = this.addFile.bind(this);	
	this.addUpload   = this.addUpload.bind(this);
	this.addMimetype = this.addMimetype.bind(this);	
	this.addLanguage = this.addLanguage.bind(this);
	this.showFiles = this.showFiles.bind(this);
	this.onDrop = this.onDrop.bind(this);
	
	this.state = {
	    files: []
	};

	//console.log('binding showFiles', this.showFiles, this.onDrop, this.addNote, this.addLane);
    }

    addLane( resourceName ) {
	var lane = LaneActions.create({name: resourceName});
	console.log('adding new lane', lane);
	return lane.id;
    }

    // a note get a task description as "knows" the lane it belongs to
    addNote( laneId, description ) {
	const note = NoteActions.create({
	    task: description,
	    belongsTo: laneId});
	
	LaneActions.attachToLane({
	    noteId: note.id,
	    laneId
	});

	// console.log('DropArea/addNote', laneId, description, 'with resulting note', note);
    }

    addFilename( laneId, filename, filenameWithDate ) {
	LaneActions.addFilename({
	    filename: filename,
	    filenameWithDate: filenameWithDate,
	    laneId
	});
	
	console.log('DropArea/addFilename', laneId, filename, filenameWithDate);
    }

    addFile( laneId, file ) {
	LaneActions.addFile({
	    file: file,
	    laneId
	});

	console.log('DropArea/addFile', laneId, file);	
    }
    

    addUpload( laneId, upload ) {
	LaneActions.addUpload({
	    upload: upload,
	    laneId
	});
	
    }
    
    addMimetype( laneId, mimetype ) {
	LaneActions.addMimetype({
	    mimetype: mimetype,
	    laneId
	});
	
	console.log('DropArea/addMimetype', laneId, mimetype);
    }
    
    addLanguage( laneId, language ) {

	// this is a temp. hack
	// all language-related code conversions with be bundled somewhere
	
	var threeLetterCode = null;

	if (language == "en") {
	    language = "English:eng";
	    threeLetterCode = "eng";
	} else if (language == "da") {
	    language = "Danish:dan";
    	    threeLetterCode = "dan";
	} else if (language == "ca") {
	    language = "Catalan:cat";
    	    threeLetterCode = "cat";	    
	} else if (language == "hu") {
	    language = "Hungarian:hun";
    	    threeLetterCode = "hun";
	} else if (language == "it") {
	    language = "Italian:ita";
    	    threeLetterCode = "ita";	    
	} else if (language == "no") {
	    language = "Norwegian:nor";
    	    threeLetterCode = "nor";
	} else if (language == "sv") {
	    language = "Swedish:swe";
    	    threeLetterCode = "swe";
	} else if (language == "de") {
	    language = "German:deu";
    	    threeLetterCode = "deu";
	} else if (language == "es") {
	    language = "Spanish:spa";
    	    threeLetterCode = "spa";
	} else if (language == "is") {
	    language = "Icelandic:isl";
    	    threeLetterCode = "isl";
	} else if (language == "pl") {
	    language = "Polish:pol";
    	    threeLetterCode = "pol";
	} else if (language == "th") {
	    language = "Thai:tha";
    	    threeLetterCode = "tha";
	} else if (language == "et") {
	    language = "Estonian:est";
    	    threeLetterCode = "est";
	} else if (language == "sk") {
	    language = "Slovak:slk";
    	    threeLetterCode = "slk";
	} else if (language == "sl") {
	    language = "Slovenian:slv";
    	    threeLetterCode = "slv";
	} else if (language == "ro") {
	    language = "Romanian:ron";
    	    threeLetterCode = "ron";	    	    	    
	} else if (language == "fi") {
	    language = "Finnish:fin";
    	    threeLetterCode = "fin";
	} else if (language == "pt") {
	    language = "Portuguese:por";
    	    threeLetterCode = "por";
	} else if (language == "el") {
	    language = "Greek:ell";
    	    threeLetterCode = "ell";
	} else if (language == "fr") {
	    language = "French:fra";
    	    threeLetterCode = "fra";
	} else if (language == "nl") {
	    language = "Dutch:nld";
    	    threeLetterCode = "nld";
	} else if (language == "ru") {
	    language = "Russian:rus";
    	    threeLetterCode = "rus";
	} else {
	    language = "Please identify language:any";
	    threeLetterCode = "any";
	}

	// english:eng
	console.log('DropArea/addLanguage after', laneId, language, threeLetterCode);	
	LaneActions.addLanguage({
	    language: threeLetterCode,
	    laneId
	});

	return language;
    }

    showFiles() {

        var files = this.state.files;
	console.log('showFiles', files);
	
        if (files.length <= 0) {
            return '';
        }

	// don't duplicate file information (apart from the preview)
	return '';
	
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
	
	//console.log('onDrop entry, processing', currentFile, newFileName); 

	// 1. store in the temporary file store at the MPG
	Request
	    .post('http://weblicht.sfs.uni-tuebingen.de/clrs/storage/'.concat(newFileName))	
	// .post('http://ws1-clarind.esc.rzg.mpg.de/drop-off/storage/'.concat(files[i].name))	
	    .send(currentFile)	
	    .set('Content-Type', currentFile.type)
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
					    
					    var laneId = this.addLane( currentFile.name );
					    
					    this.addFile(laneId, currentFile);
					    this.addFilename(laneId, currentFile.name, newFileName);
					    this.addUpload(laneId, 'dnd');
					    this.addMimetype(laneId, currentFile.type);
					    
					    languageDetected = this.addLanguage(laneId, languageDetected);
					    
					    this.addNote(laneId, "name:   ".concat(currentFile.name));
					    this.addNote(laneId, "type:   ".concat(currentFile.type));
					    this.addNote(laneId, "size:   ".concat(currentFile.size));	
					    this.addNote(laneId, "language:".concat(languageDetected));
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
