import React from 'react'
import ReactDOM from 'react-dom';
import Loader from 'react-loader';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';
import AlertShibboleth from './AlertShibboleth.jsx';
import AlertURLFetchError from './AlertURLFetchError.jsx';

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
	this.fetchURL          = this.fetchURL.bind(this);

	this.state = {
	    isLoaded: false,
	    showAlertShibboleth: false,
	    showAlertURLFetchError: false,
	    resource: undefined
	};

	console.log('UrlArea/constructor: this.props', this.props);
    }

    // Take the mimetype detection from the 'browser' when downloading the resource from provider (res.type)
    // Todo: use of Apache TIKA for language detection
    fetchURL( caller, fileURL ) {
	var that = this;
	var req = Request
	    .get(fileURL)	
	    .end(function(err, res){
		
		// done with loading, discontinue spinner
		that.setState( { isLoaded: true });

		if (err) {
   		    // show fetch alert
		    that.setState({showAlertURLFetchError: true} );
		} else {
		    // record file in state
		    that.setState( { resource : res } );
		    console.log('UrlArea/fetchURL: ', res, res.header['content-type'], res.header['content-length']);

		    // check whether we've fetched the Shibboleth login
		    if ( (res.text.indexOf('Shibboleth') != -1))  {
			that.setState({showAlertShibboleth: true});
		    } else {
		    

			// create lane
			var lane = LaneActions.create( { name: fileURL,
							 filename: fileURL,
							 upload: caller,
							 mimetype: res.type
						       } );
			var laneId = lane.id;
			that.addNote(laneId, "name:   ".concat( fileURL ));
			that.addNote(laneId, "type:   ".concat( res.type ));
			that.addNote(laneId, "size:   not determined");	

			var languageHarmonization = "identify language!";
			var protocol = window.location.protocol;
			console.log('UrlArea/fetchURL: calling TIKA for language detection', protocol);
			Request
			    .put(protocol.concat('//weblicht.sfs.uni-tuebingen.de/clrs/language/string'))
			    .send(res.text)	
			    .set('Content-Type', res.type)	
			    .end((err, langDetectResult) => {
				if (err) {
				    console.log('error: language identification', err);
				} else {
				    console.log('success: language identification', langDetectResult.text);
				    languageHarmonization = that.processLanguage(langDetectResult.text);
				    
				    that.addNote(laneId, "language:".concat( languageHarmonization.languageCombo ));
				    LaneActions.addLanguage( { laneId: laneId,
							       language: languageHarmonization.threeLetterCode})
				}})
		    }
		}
	    });
	return true;
    }

    addNote( laneId, description ) {
        console.log('UrlArea/addNote', laneId, description);
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
	var protocol = window.location.protocol;
	var hdlLongPrefix  = protocol.concat("//hdl.handle.net/");	
	var index = handle.indexOf(hdlShortPrefix);

	var result = decodeURIComponent(handle);

	if (index > -1) {
	    result = hdlLongPrefix.concat( handle.substring(index+hdlShortPrefix.length, handle.length) );
	    console.log('UrlArea/unfoldHandle success', handle, result, result);	    
	} else {
	    console.log('UrlArea/unfoldHandle not need to unfold', handle);
	}

	return result;
    }
    
    processParameters( caller, parameters ) {

	// first, reset prior history
	LaneActions.reset();
	NoteActions.reset();
	this.forceUpdate();
	
	console.log('UrlArea/processParameters', caller);

	// just in case, we've got a hdl
	var fileURL = this.unfoldHandle( parameters.fileURL);
	
	
	// when called from the VCR, the FCS, or B2DROP, we just get the URL, nothing else.
	if ( (caller == "VCR") || (caller == "FCS") || (caller == "B2DROP") ) {
	    
	    console.log('UrlArea/processParameters: called from the VCR/FCS/B2DROP');
	    // fetch the resource, and set the information accordingly
	    this.fetchURL(caller, fileURL);
	    
	} else {
	    console.log('UrlArea/processParameters: called from the VLO with parameters', parameters);
	    console.log('UrlArea/processParameters:', this.state);

	    // "normal" call from the VLO
	    if (parameters.tokenId == undefined) {

		// need to identify mimetype, SHOULD (CURRENTLY) NOT HAPPEN
		if (parameters.fileMimetype == undefined) {
		    console.log('the filetype of the resource needs to be identified');
		}

		// need to identfy language, SHOULD (CURRENTLY) NOT HAPPEN
		if (parameters.fileLanguage == undefined) {
		    console.log('the language of the resource needs to be identified');
		}
		
		// information for a single file has been passed (passing multiple files is not possible).
		var languageHarmonization = this.processLanguage(parameters.fileLanguage);	    
		var mimeType = decodeURIComponent(parameters.fileMimetype);
		var lane = LaneActions.create( { name: fileURL,
						 filename: fileURL,
						 upload: 'VLO',
						 mimetype: mimeType,
						 language: languageHarmonization.threeLetterCode
					       } );
		var laneId = lane.id;
	    
		this.addNote(laneId, "name:   ".concat( fileURL ));
		this.addNote(laneId, "type:   ".concat(mimeType));
		this.addNote(laneId, "size:   ".concat(parameters.fileSize));	
		this.addNote(laneId, "language:".concat(languageHarmonization.languageCombo));

		this.setState( { isLoaded: true });
		this.props.refreshFun();		

	    } else {
     	       this.setState( { isLoaded: true });	    
		// purely explorational (see below)
		console.log('UrlArea/processParameters: a token has been passed', parameters);
		this.getJSON( parameters.tokenId );
	    }
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
					     upload: 'VLO',
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

	// fetch all parameter from router
	const parameters = this.props.match.params;

	// the caller, one of VLO, VCR, FCS, or B2DROP
	const caller = this.props.caller;
	
	console.log('UrlArea/componentDidMount: this.props.params', parameters, caller);
	this.processParameters(caller, parameters);
    }
	
    render() {
	const { isLoaded } = this.state;

	var style = {
	    fontSize: '0.5em',
            margin: 2,
            padding: 2	    
        };

	var transferalInfo = `Resource transferal from ${this.props.caller}. Please check the information below, then press "Show Tools"`;
	// if (this.props.match.params.tokenId !== undefined) {
	//     transferalInfo = 'Resource via token-based tranferal (experimental).'
	// }
	return (
	       <Loader loaded={isLoaded}>
		<h2>
		   <div style={style} >
		     {transferalInfo}
                   </div>
		</h2>
		{this.state.showAlertShibboleth ?
    		 <AlertShibboleth />
		 : null }

	        {this.state.showAlertURLFetchError ?
		 <AlertURLFetchError />
		 : null }
               </Loader>		    
	    );
    }
}
