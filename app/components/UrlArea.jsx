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
	
	this.processLanguage   = this.processLanguage.bind(this);
	
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
			alert('Resource may not not public, please try to fetch the resource with your authentification credentials! Click on "Link to Resource"')
		    }
		}
	    });

	// be optimistic
	return true;
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

    processLanguage( language ) {

	// this is a temp. hack
	// all language-related code conversions with be bundled somewhere
	
	var languageCombo = null;
	var threeLetterCode = null;

	if (language == "en") {
	    languageCombo = "English:eng";
	    threeLetterCode = "eng";
	} else if (language == "da") {
	    languageCombo = "Danish:dan";
    	    threeLetterCode = "dan";
	} else if (language == "ca") {
	    languageCombo = "Catalan:cat";
    	    threeLetterCode = "cat";	    
	} else if (language == "hu") {
	    languageCombo = "Hungarian:hun";
    	    threeLetterCode = "hun";
	} else if (language == "it") {
	    languageCombo = "Italian:ita";
    	    threeLetterCode = "ita";	    
	} else if (language == "no") {
	    languageCombo = "Norwegian:nor";
    	    threeLetterCode = "nor";
	} else if (language == "sv") {
	    languageCombo = "Swedish:swe";
    	    threeLetterCode = "swe";
	} else if (language == "de") {
	    languageCombo = "German:deu";
    	    threeLetterCode = "deu";
	} else if (language == "es") {
	    languageCombo = "Spanish:spa";
    	    threeLetterCode = "spa";
	} else if (language == "is") {
	    languageCombo = "Icelandic:isl";
    	    threeLetterCode = "isl";
	} else if (language == "pl") {
	    languageCombo = "Polish:pol";
    	    threeLetterCode = "pol";
	} else if (language == "th") {
	    languageCombo = "Thai:tha";
    	    threeLetterCode = "tha";
	} else if (language == "et") {
	    languageCombo = "Estonian:est";
    	    threeLetterCode = "est";
	} else if (language == "sk") {
	    languageCombo = "Slovak:slk";
    	    threeLetterCode = "slk";
	} else if (language == "sl") {
	    languageCombo = "Slovenian:slv";
    	    threeLetterCode = "slv";
	} else if (language == "ro") {
	    languageCombo = "Romanian:ron";
    	    threeLetterCode = "ron";	    	    	    
	} else if (language == "fi") {
	    languageCombo = "Finnish:fin";
    	    threeLetterCode = "fin";
	} else if (language == "pt") {
	    languageCombo = "Portuguese:por";
    	    threeLetterCode = "por";
	} else if (language == "el") {
	    languageCombo = "Greek:ell";
    	    threeLetterCode = "ell";
	} else if (language == "fr") {
	    languageCombo = "French:fra";
    	    threeLetterCode = "fra";
	} else if (language == "nl") {
	    languageCombo = "Dutch:nld";
    	    threeLetterCode = "nld";
	} else if (language == "ru") {
	    languageCombo = "Russian:rus";
    	    threeLetterCode = "rus";
	} else {
	    languageCombo = "Please identify language:any";
	    threeLetterCode = "any";
	}

	return { languageCombo  : languageCombo,
		 threeLetterCode: threeLetterCode
	       };
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
	    var fileURL = this.unfoldHandle( parameters.fileURL);
	    var languageHarmonization = this.processLanguage(parameters.fileLanguage);	    
	    
	    var lane = LaneActions.create( { name: fileUrl,
					     filename: fileUrl,
					     upload: 'vlo',
					     mimetype: parameters.fileMimetype,
					     language: languageHarmonization.threeLetterCode
					   } );

	    var laneId = lane.id;
	    
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

    // exploring an alternative way of passing information
    // Here, the VLO invokes the LRS with a token, once received the LRS requests from the VLO
    // a JSON-based metadata description for such a given token
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

    // experimental, see getJSON
    processJSONData( files ) {
	console.log('UrlArea/processJSONData', files);

	for (var i=0; i<files.length; i++) {
	    var languageHarmonization = this.processLanguage(files[i].language);	    
	    var lane = LaneActions.create( { name: files[i].file,
					     filename: files[i].file,
					     upload: 'vlo',
					     mimetype: files[i].mimetype,
					     language: languageHarmonization.threeLetterCode
					   } );

	    var laneId = lane.id;
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
