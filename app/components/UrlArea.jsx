import React from 'react'
import ReactDOM from 'react-dom';
import Loader from 'react-loader';
import ResourceActions from '../actions/ResourceActions';
import AlertShibboleth from './AlertShibboleth.jsx';
import AlertURLFetchError from './AlertURLFetchError.jsx';

import Request from 'superagent';
import {processLanguage, unfoldHandle} from '../back-end/util';

import Downloader from '../back-end/Downloader';
import Profiler from '../back-end/Profiler';

export default class UrlArea extends React.Component {
    constructor(props) {
	super(props);

	this.processParameters   = this.processParameters.bind(this);
	this.fetchAndProcessURL  = this.fetchAndProcessURL.bind(this);

	this.state = {
	    isLoaded: false,
	    showAlertShibboleth: false,
	    showAlertURLFetchError: false
	};
    }

    fetchAndProcessURL( caller, fileURL ) {

	// local b2drop instance
	// https://weblicht.sfs.uni-tuebingen.de/owncloud/index.php/s/B5nlhfHbPiac3OF/download
	var corsLink = "";
	if ( fileURL.indexOf("https://www.dropbox.com") !== -1 ) {
	    corsLink = fileURL.replace('https://www.dropbox.com', '/www-dropbox-com');
	    corsLink = corsLink.replace('?dl=0', '?dl=1');
	} else if ( fileURL.indexOf("https://b2drop.eudat.eu") !== -1 ) {
	    corsLink = fileURL.replace('https://b2drop.eudat.eu', '/b2drop-eudat-eu').concat('/download');
	} else if ( fileURL.indexOf("https://weblicht.sfs.uni-tuebingen.de/nextcloud") !== -1 ) {
	    corsLink = fileURL.replace('https://weblicht.sfs.uni-tuebingen.de/nextcloud', '/weblicht-sfs-nextcloud').concat('/download');
	} else if ( fileURL.indexOf("https://fsd-cloud48.zam.kfa-juelich.de") !== -1 ) {
	    corsLink = fileURL.replace('https://fsd-cloud48.zam.kfa-juelich.de', '/zam-kfa-juelich').concat('/download');	    
	} else if ( fileURL.indexOf("http://cloud.zinnwerk.com") !== -1 ) {
	    corsLink = fileURL.replace('http://cloud.zinnwerk.com', '/cloud-zinnwerk').concat('/download');
	    
	    // https://www.icloud.com/#iclouddrive/0QRZuHeqL47qSZULlOXaX1Aww
	    // https://www.icloud.com/iclouddrive/0QRZuHeqL47qSZULlOXaX1Aww#englishTextCatalonia.txt
	    // this is currently not supported as it is undocumented how to download the shared link automatically (e.g., with curl)
	} else if ( fileURL.indexOf("https://www.icloud.com") !== -1 ) {
	    corsLink = fileURL.replace('https://www.icloud.com', '/icloud-apple').concat('/download');
	    
	} else {
	    alert('For the time being, only official dropbox and b2drop account links are being processed. Please check your shared link');
	    return;
	}

	var fullFileURL = fileURL; // .concat('/download');
	
	var fullCorsLink = window.location.origin.concat('/clrs').concat(corsLink);
	console.log('UrlArea/fetchAndProcessURL: window.location.origin full', fullCorsLink);
	
//	fullCorsLink = "localhost/clrs".concat(corsLink);
//	console.log('UrlArea/fetchAndProcessURL: localhost', fullCorsLink);	

	// all back
//	fullCorsLink = fileURL;
//	corsLink = fileURL;
//	console.log('UrlArea/fetchAndProcessURL: all reset', fullCorsLink, corsLink);		
	let downloader = new Downloader( fullCorsLink );
	let promiseDownload = downloader.downloadFile();
	let that = this;

	
	
	promiseDownload.then(
	    function(resolve) {
		that.setState( { isLoaded: true });		
		// check whether we've fetched the Shibboleth login
		if ( (resolve.text.indexOf('Shibboleth') != -1))  {
		    that.setState({showAlertShibboleth: true});
		} else {
		    var downloadedFile = new File([resolve.text], corsLink, {type: resolve.type});
		    let profiler = new Profiler( downloadedFile, caller, fullFileURL );
		    that.setState( { isLoaded: false });				    
		    let promiseLanguage = profiler.identifyLanguage();
		    promiseLanguage.then(
			function(resolve) {
			    that.setState( { isLoaded: true });				    			    
			    let promiseMimeType = profiler.identifyMimeType();
			    promiseMimeType.catch(
				function(reject) {
				    console.log('mimetype id failed', reject);
				})},
			function(reject) {
			    that.setState( { isLoaded: true });				    			    			    
			    console.log('language identification failed', reject) })}
	    },
	    function(reject) {
		// show fetch alert
		that.setState({showAlertURLFetchError: true} );
	    })
    }
    
    processParameters( caller, parameters ) {

	// first, reset prior history
	ResourceActions.reset();
	// this.forceUpdate();
	
	// just in case, we've got a hdl
	var fileURL = unfoldHandle( parameters.fileURL);
	
	// when called from the VCR, the FCS, or B2DROP, we just get the URL, nothing else.
	if ( (caller == "VCR") || (caller == "FCS") || (caller == "B2DROP") ) {
	    // fetch the resource, and profile it
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

	    // update the Resource panel
	    var resource = ResourceActions.create( { name: fileURL,
						     remoteFilename: fileURL,
						     upload: 'VLO',
						     mimetype: mimeType,
						     size: parameters.fileSize,
						     language: languageHarmonization
						   } );
	    this.setState( { isLoaded: true });
//	    this.props.refreshFun();		
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
