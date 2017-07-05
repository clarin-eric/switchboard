import React from 'react'
import ReactDOM from 'react-dom';
import Loader from 'react-loader';
import NoteActions from '../actions/NoteActions';
import ResourceActions from '../actions/ResourceActions';
import AlertShibboleth from './AlertShibboleth.jsx';
import AlertURLFetchError from './AlertURLFetchError.jsx';

import Request from 'superagent';
import {processLanguage, unfoldHandle} from '../libs/util';

import Downloader from '../libs/Downloader';
import Profiler from '../libs/Profiler';

export default class UrlArea extends React.Component {
    constructor(props) {
	super(props);

	this.addNote       = this.addNote.bind(this);
	
	this.processParameters   = this.processParameters.bind(this);
	this.fetchAndProcessURL  = this.fetchAndProcessURL.bind(this);

	this.state = {
	    isLoaded: false,
	    showAlertShibboleth: false,
	    showAlertURLFetchError: false
	};
    }

    fetchAndProcessURL( caller, fileURL ) {

	let downloader = new Downloader( fileURL );
	let promiseDownload = downloader.downloadFile();
	let that = this;
	
	promiseDownload.then(
	    function(resolve) {
		console.log('UrlArea/fetchAndProcessURL', resolve);
		that.setState( { isLoaded: true });		
		// check whether we've fetched the Shibboleth login
		if ( (resolve.text.indexOf('Shibboleth') != -1))  {
		    that.setState({showAlertShibboleth: true});
		} else {
		    var downloadedFile = new File([resolve.text], fileURL, {type: resolve.type});
		    console.log('UrlArea/fetchAndProcessURL file', downloadedFile);		    
		    let profiler = new Profiler( downloadedFile, caller );
		    let promiseLanguage = profiler.identifyLanguage();
		    promiseLanguage.then(
			function(resolve) {
			    let promiseMimeType = profiler.identifyMimeType();
			    promiseMimeType.catch(
				function(reject) {
				    console.log('mimetype id failed', reject);
				})},
			function(reject) {
			    console.log('language identification failed', reject) })}
	    },
	    function(reject) {
		// show fetch alert
		that.setState({showAlertURLFetchError: true} );
	    })
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

    
    processParameters( caller, parameters ) {

	// first, reset prior history
	ResourceActions.reset();
	NoteActions.reset();
	this.forceUpdate();
	
	console.log('UrlArea/processParameters', caller);

	// just in case, we've got a hdl
	var fileURL = unfoldHandle( parameters.fileURL);
	
	
	// when called from the VCR, the FCS, or B2DROP, we just get the URL, nothing else.
	if ( (caller == "VCR") || (caller == "FCS") || (caller == "B2DROP") ) {
	    
	    console.log('UrlArea/processParameters: called from the VCR/FCS/B2DROP');
	    // fetch the resource, and set the information accordingly
	    this.fetchAndProcessURL(caller, fileURL);
	    
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
