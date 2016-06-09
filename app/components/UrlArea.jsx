import React from 'react'
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';
import ToolActions from '../actions/ToolActions';
import Request from 'superagent';

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
	this.getJSON       = this.getJSON.bind(this);	
	this.processJSONData = this.processJSONData.bind(this);
	this.nilOperation    = this.nilOperation.bind(this);
	this.unfoldHandle    = this.unfoldHandle.bind(this);
	this.prefetch_URL    = this.prefetch_URL.bind(this);
	
	this.state = {
	    files: []
	};

	console.log('in constructor: this.props.params', this.props.params);
	var parameters = this.props.params;
	this.useParameters(parameters);
    }

    prefetch_URL( URL, expectedMimetype ) {

	console.log('UrlArea/prefetch_URL: at start', URL);	
	var req = Request
	    .get(URL)	
	    // .head(URL)
	    .end(function(err, res){
		if (err) {
		    console.log('UrlArea/prefetch_URL: error in prefetching URL',   err, URL);
		} else {
		    console.log('UrlArea/prefetch_URL: success in prefetching URL', JSON.stringify(res), res.type);
		    if (res.type == expectedMimetype) {
			console.log('prefetch_URL' ,res.type, expectedMimetype);
		    } else {
			alert('Resource may not not public, please try to fetch the resource with your authentification credentials!')
		    }
		}
	    });

	// be optimistic
	return true;
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

    nilOperation() {
	console.log('called nil operation');
    }

    unfoldHandle( handle ) {
	var hdlShortPrefix = "hdl:";
	var hdlLongPrefix  = "http://hdl.handle.net/";	
	var index = handle.indexOf(hdlShortPrefix);

	var result = handle;

	if (index > -1) {
	    result = hdlLongPrefix.concat( handle.substring(index+hdlShortPrefix.length, handle.length) );
	}

	console.log( 'UrlArea/unfoldHandle', handle, result);
	return result;
    }
    
    useParameters( parameters ) {
	
        // var files = this.state.files;	
	// this.setState({
	//     files: files
	// });
	
	// reset all prior info
	LaneActions.reset();
	NoteActions.reset();
	ToolActions.reset();

	if (parameters.tokenId == undefined) {
	    // single file information has been passed
	    // console.log('UrlArea/useParameters: single file information has been passed', parameters);

	    var fileURL = this.unfoldHandle( parameters.fileURL);
	    var laneId = this.addLane( fileURL );
	    this.addFilename(laneId, fileURL );
	    this.addUpload(laneId, "vlo");	
	    this.addMimetype(laneId, parameters.fileMimetype);
	    var languageDetected = this.addLanguage(laneId, parameters.fileLanguage);
	    this.addNote(laneId, "name:   ".concat( fileURL ));
	    this.addNote(laneId, "type:   ".concat(parameters.fileMimetype));
	    this.addNote(laneId, "size:   ".concat(parameters.fileSize));	
	    this.addNote(laneId, "language:".concat(languageDetected));

	    // check whether a tool could fetch the resource in question.
	    // (todo: consider this being extra component)
	    
	    this.prefetch_URL(fileURL, parameters.fileMimetype);
	    
	} else {
	    console.log('UrlArea/useParameters: a token has been passed', parameters);
	    this.getJSON( parameters.tokenId );
	    // contact the VLO to send associated JSON data with token
	    
	}
    }

    getJSON( tokenId ) {
	console.log('UrlArea/getJSON', tokenId);
	let vloService = "http://localhost:8011/api/getJSON";
	var req = Request
	    .post(vloService)
	    .send({ token: tokenId })
	    .set('Accept', 'application/json')
	    .end((err, res) => {
		if (err) {
		    console.log('UrlArea/getJSON: error in calling VLO with token',   err, tokenId);
		} else {
		    console.log('UrlArea/getJSON: success in calling VLO with token', JSON.stringify(res.body));
		    this.processJSONData( res.body.resources );
		}
	    });
    }

    processJSONData( files ) {
	console.log('UrlArea/processJSONData', files);

	for (var i=0; i<files.length; i++) {
	    var laneId = this.addLane(files[i].file);
	    this.addFilename(laneId, files[i].file);
	    this.addUpload(laneId, 'vlo');
	    this.addMimetype(laneId, files[i].mimetype);
	    var languageDetected = this.addLanguage(laneId, files[i].language);
	    this.addNote(laneId, "name:   ".concat(files[i].file));
	    this.addNote(laneId, "type:   ".concat(files[i].mimetype));
	    this.addNote(laneId, "size:   ".concat(files[i].size));	
	    this.addNote(laneId, "language:".concat(languageDetected));
	}
    }
    
    render() {

	var style = {
	    fontSize: '0.5em',
            margin: 2,
            padding: 2	    
        };

	// console.log('this.props.params', this.props.params);
	var parameters = this.props.params

	if (this.props.params.tokenId == undefined) {
	    return React.createElement(
		'h2',
		null,
		React.createElement(
		    'div',
		    {
			style: style
		    },
		    'You have been transferred from the VLO. Please check the information below, then press "Show Tools".'
		),
		// this.useParameters(parameters)
		this.nilOperation()
            );
	} else {
	    return React.createElement(
		'h2',
		null,
		React.createElement(
		    'div',
		    {
			style: style
		    },
		    'All File Information has been passed via a token-based JSON transmission.'
		),
		this.useParameters(parameters)
            );
	}
	
    }
}
