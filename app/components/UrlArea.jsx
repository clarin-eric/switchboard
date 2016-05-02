import React from 'react'
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';
import ToolActions from '../actions/ToolActions';


export default class UrlArea extends React.Component {
    constructor(props) {
	super(props);

	this.addLane       = this.addLane.bind(this);
	this.addNote       = this.addNote.bind(this);
	this.addFilename   = this.addFilename.bind(this);
	this.addUpload     = this.addUpload.bind(this);
	this.addMimetype   = this.addMimetype.bind(this);	
	this.addLanguage   = this.addLanguage.bind(this);
	this.useParameters = this.useParameters.bind(this);

	this.state = {
	    files: []
	};
	
	console.log('binding showFiles', this.useParameters, this.addNote, this.addLane);	
    }

    addLane( resourceName ) {
	var lane = LaneActions.create({name: resourceName});
	console.log('adding new lane', lane);	
	return lane.id;
    }

    addNote( laneId, description ) {
	const note = NoteActions.create({
	    task: description,
	    belongsTo: laneId});
	
	LaneActions.attachToLane({
	    noteId: note.id,
	    laneId
	});
    }

    addFilename( laneId, filename ) {
	LaneActions.addFilename({
	    filename: filename,
	    laneId
	});
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
    
    addLanguage( laneId, threeLetterCode ) {
	
	var language = threeLetterCode;
	
	if (language == "eng") {
	    language = "English:eng";
	} else if (language == "dan") {
	    language = "Danish:dan";
	} else if (language == "cat") {
	    language = "Catalan:cat";
	} else if (language == "hun") {
	    language = "Hungarian:hun";
	} else if (language == "ita") {
	    language = "Italian:ita";
	} else if (language == "nor") {
	    language = "Norwegian:nor";
	} else if (language == "swe") {
	    language = "Swedish:swe";
	} else if (language == "deu") {
	    language = "German:deu";
	} else if (language == "spa") {
	    language = "Spanish:spa";
	} else if (language == "isi") {
	    language = "Icelandic:isl";
	} else if (language == "pol") {
	    language = "Polish:pol";
	} else if (language == "tha") {
	    language = "Thai:tha";
	} else if (language == "est") {
	    language = "Estonian:est";
	} else if (language == "slk") {
	    language = "Slovak:slk";
	} else if (language == "sll") {
	    language = "Slovenian:slv";
	} else if (language == "ron") {
	    language = "Romanian:ron";
	} else if (language == "fin") {
	    language = "Finnish:fin";
	} else if (language == "por") {
	    language = "Portuguese:por";
	} else if (language == "ell") {
	    language = "Greek:ell";
	} else if (language == "fra") {
	    language = "French:fra";
	} else if (language == "nld") {
	    language = "Dutch:nld";
	} else if (language == "rus") {
	    language = "Russian:rus";
	} else {
	    language = "Please identify language:any";
	}

	// english:eng
	console.log('UrlArea/addLanguage after', laneId, language, threeLetterCode);	
	LaneActions.addLanguage({
	    language: threeLetterCode,
	    laneId
	});

	return language;
    }

    useParameters( parameters ) {
	
        // var files = this.state.files;	
	// this.setState({
	//     files: files
	// });
	
	// first, reset all prior info
	LaneActions.reset();
	NoteActions.reset();
	ToolActions.reset();

	
	console.log('useParameters', parameters);
	
	var laneId = this.addLane(parameters.fileURL);
	this.addFilename(laneId, parameters.fileURL);
	this.addUpload(laneId, "vlo");	
	this.addMimetype(laneId, parameters.fileMimetype);
	var languageDetected = this.addLanguage(laneId, parameters.fileLanguage);
	this.addNote(laneId, "name:   ".concat(parameters.fileURL));
	this.addNote(laneId, "type:   ".concat(parameters.fileMimetype));
	this.addNote(laneId, "size:   ".concat(parameters.fileSize));	
	this.addNote(laneId, "language:".concat(languageDetected));
    }
    
    render() {

	var style = {
	    align: 'center',
        };

	console.log('this.props.params', this.props.params);
	var parameters = this.props.params
	
	return React.createElement(
	    'h2',
	    null,
	    React.createElement(
		'div',
		{
		    style: style
		},
		'File Information has been passed via parameters'
	    ),
	    this.useParameters(parameters)
        );
    }
}
