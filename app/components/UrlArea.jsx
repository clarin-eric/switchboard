import React from 'react'
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';
import ToolActions from '../actions/ToolActions';
import Request from 'superagent';
import util from '../libs/util';

export default class UrlArea extends React.Component {
    constructor(props) {
	super(props);

	this.addNote       = this.addNote.bind(this);
	
	this.processLanguage   = util.processLanguage.bind(this);
	
	this.useParameters = this.useParameters.bind(this);
	this.getJSON       = this.getJSON.bind(this);	
	this.processJSONData = this.processJSONData.bind(this);
	this.nilOperation    = this.nilOperation.bind(this);
	this.unfoldHandle    = this.unfoldHandle.bind(this);
	this.prefetch_URL    = this.prefetch_URL.bind(this);
	
	this.state = {
	    files: []
	};

	console.log('in constructor: this.props.params', this.props.params, 'all props:', this.props, 'with caller:', this.props.route.caller);
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

	console.log('UrlArea/useParameters', parameters);
	// reset prior history
	LaneActions.reset();
	NoteActions.reset();
	ToolActions.reset();

	if (parameters.tokenId == undefined) {
	    // single file information has been passed
	    var fileURL = this.unfoldHandle( parameters.fileURL);
	    var languageHarmonization = this.processLanguage(parameters.fileLanguage);	    
	    
	    var lane = LaneActions.create( { name: fileURL,
					     filename: fileURL,
					     upload: 'vlo',
					     mimetype: parameters.fileMimetype,
					     language: languageHarmonization.threeLetterCode
					   } );
	    var laneId = lane.id;
	    
	    this.addNote(laneId, "name:   ".concat( fileURL ));
	    this.addNote(laneId, "type:   ".concat(parameters.fileMimetype));
	    this.addNote(laneId, "size:   ".concat(parameters.fileSize));	
	    this.addNote(laneId, "language:".concat(languageHarmonization.languageCombo));

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

	console.log('UrlArea/render: this.props.params', this.props.params);
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
