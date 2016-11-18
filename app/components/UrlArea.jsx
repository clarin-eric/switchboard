import React from 'react'
import Loader from 'react-loader';
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
	
	this.processParameters = this.processParameters.bind(this);
	this.getJSON           = this.getJSON.bind(this);	
	this.processJSONData   = this.processJSONData.bind(this);
	this.unfoldHandle      = this.unfoldHandle.bind(this);
	this.prefetch_URL      = this.prefetch_URL.bind(this);

	this.state = {
	    isLoaded: false
	};	

	console.log('in constructor: this.props.params', this.props.params, 'with caller:', this.props.route.caller);
	var parameters = this.props.params;
	// this.processParameters(parameters);
    }

    // Take the mimetype detection from the 'browser' when downloading the resource from provider.
    // Similar to DropArea, we could plug-in Apache TIKA for second opinion.
    // Todo: use of Apache TIKA for language detection
    prefetch_URL( URL, expectedMimetype ) {

	console.log('UrlArea/prefetch_URL: at start', URL);
	var that = this;
	var req = Request
	    .get(URL)	
	    .end(function(err, res){
		
		// loading came to an end
		that.setState( { isLoaded: true });

		// show alert, depending on the result
		if (err) {
		    alert('Cannot retrieve the resource. Please try to fetch the resource by clicking on "Link to Resource"');
		} else {
		    console.log('UrlArea/prefetch_URL: success in prefetching URL', JSON.stringify(res), res.type, expectedMimetype);
		    if (res.type == expectedMimetype) {
			// in case we wanted text/html and got the text/html Shibboleth login page, this won't work
			console.log('prefetch_URL: at end with res', res, res.type, expectedMimetype);
		    } else {
			// To be improved, check whether res.text includes Shibboleth
			alert('Resource may not not public, please try to fetch the resource with your authentification credentials! Click on "Link to Resource"')
		    }
		}
	    });
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
    
    processParameters( parameters ) {

	console.log('UrlArea/processParameters', parameters);
	// reset prior history
	LaneActions.reset();
	NoteActions.reset();
	ToolActions.reset();

	if (parameters.tokenId == undefined) {
	    // information for a single file has been passed (multiple files not possible).
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
	    this.prefetch_URL(fileURL, parameters.fileMimetype);
	    
	} else {
	    console.log('UrlArea/processParameters: a token has been passed', parameters);
	    this.getJSON( parameters.tokenId );
	}
    }

    // Purely explorational. 
    // Here, the VLO invokes the LRS with a token; once it is received, the LRS requests from the VLO
    // a JSON-based metadata description for given token
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

    componentDidMount() {
	const parameters = this.props.params;
	console.log('UrlArea/componentDidMount: this.props.params', parameters);
	this.processParameters(parameters);
    }
	
    render() {
	const { isLoaded } = this.state;

	var style = {
	    fontSize: '0.5em',
            margin: 2,
            padding: 2	    
        };

	var transferalInfo = `Resource transferal from the ${this.props.route.caller}. Please check the information below, then press "Show Tools"`;
	if (this.props.params.tokenId !== undefined) {
	    transferalInfo = 'Resource via token-based tranferal (experimental).'
	}
	return (
	       <Loader loaded={isLoaded}>
		  <h2>
		    <div style={style} >
		    {transferalInfo}
		    </div>
		  </h2>
               </Loader>		    
	    );
    }
}
