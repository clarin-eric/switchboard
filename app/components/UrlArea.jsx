import React from 'react'
import ReactDOM from 'react-dom';
import Loader from 'react-loader';
import NoteActions from '../actions/NoteActions';
import ResourceActions from '../actions/ResourceActions';
import AlertShibboleth from './AlertShibboleth.jsx';
import AlertURLFetchError from './AlertURLFetchError.jsx';

import Request from 'superagent';
import {processLanguage} from '../libs/util';

export default class UrlArea extends React.Component {
    constructor(props) {
	super(props);

	this.addNote       = this.addNote.bind(this);
	
	this.processParameters = this.processParameters.bind(this);
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
    // CZ: may go to Download.js (see Upload.js)
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
		    

			// create resource
			var resource = ResourceActions.create( { name: fileURL,
							 filename: fileURL,
							 upload: caller,
							 mimetype: res.type
						       } );
			var resourceId = resource.id;
			that.addNote(resourceId, "name:   ".concat( fileURL ));
			that.addNote(resourceId, "type:   ".concat( res.type ));
			that.addNote(resourceId, "size:   not determined");	

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
				    languageHarmonization = processLanguage(langDetectResult.text);
				    
				    that.addNote(resourceId, "language:".concat( languageHarmonization.languageCombo ));
				    ResourceActions.addLanguage( { resourceId: resourceId,
							       language: languageHarmonization.threeLetterCode})
				}})
		    }
		}
	    });
	return true;
    }

    addNote( resourceId, description ) {
        console.log('UrlArea/addNote', resourceId, description);
	const note = NoteActions.create({
	    task: description,
	    belongsTo: resourceId});
	
	ResourceActions.attachToResource({
	    noteId: note.id,
	    resourceId
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
	ResourceActions.reset();
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
	    
	    if (parameters.fileMimetype == undefined) {
		alert('Please identify the media type of the resource !');
	    }
	    if (parameters.fileLanguage == undefined) {
		alert('Please identify the language of the resource !');
	    }


	    var languageHarmonization = processLanguage(parameters.fileLanguage);	    
	    var mimeType = decodeURIComponent(parameters.fileMimetype);
	    var resource = ResourceActions.create( { name: fileURL,
						     filename: fileURL,
						     upload: 'VLO',
						     mimetype: mimeType,
						     language: languageHarmonization.threeLetterCode
						   } );
	    var resourceId = resource.id;
	    
	    this.addNote(resourceId, "name:   ".concat( fileURL ));
	    this.addNote(resourceId, "type:   ".concat(mimeType));
	    this.addNote(resourceId, "size:   ".concat(parameters.fileSize));	
	    this.addNote(resourceId, "language:".concat(languageHarmonization.languageCombo));

	    this.setState( { isLoaded: true });
	    this.props.refreshFun();		
	}
    }

    componentDidMount() {

	// fetch all parameter from router
	const parameters = this.props.match.params;

	// get the caller, one of VLO, VCR, FCS, or B2DROP
	const caller = this.props.caller;

	// process parameters
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
