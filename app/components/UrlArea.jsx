import React from 'react'
import ReactDOM from 'react-dom';
import Loader from 'react-loader';
import ResourceActions from '../actions/ResourceActions';
import AlertShibboleth from './AlertShibboleth.jsx';
import AlertURLFetchError from './AlertURLFetchError.jsx';

import Request from 'superagent';
import {fileExtensionChooser, urlPath, fileStorage, processLanguage, unfoldHandle, rewriteURL} from '../back-end/util';
import Downloader from '../back-end/Downloader';
import Uploader from '../back-end/Uploader';
import Resolver from '../back-end/Resolver';
import Profiler from '../back-end/Profiler';

export default class UrlArea extends React.Component {
    constructor(props) {
	super(props);

	this.processParameters         = this.processParameters.bind(this);
	this.fetchAndProcessURL        = this.fetchAndProcessURL.bind(this);
	this.fetchUploadAndProcessURL  = this.fetchUploadAndProcessURL.bind(this);
	this.resolveHandle             = this.resolveHandle.bind(this);

	this.state = {
	    isLoaded: false,
	    showAlertShibboleth: false,
	    showAlertURLFetchError: false
	};
    }

    fetchAndProcessURL( caller, fileURL ) {
	var corsLink = rewriteURL( caller, fileURL )
	let downloader = new Downloader( corsLink );
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
		    let profiler = new Profiler( downloadedFile, caller, fileURL );
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


    // this does a Python request to read the location from a 303
    resolveHandle( caller, fileURL ) {
	var corsLink = rewriteURL( caller, fileURL )
	let downloader = new Downloader( corsLink );
	let promiseDownload = downloader.downloadFile();
	let that = this;
	promiseDownload.then(
	    function(resolve) {
		that.setState( { isLoaded: true });
		console.log('URLArea/resolveHandle success', resolve.text)
	    },
	    function(reject) {
		console.log('URLArea/resolveHandle failure', reject)		
		that.setState({showAlertURLFetchError: true} );
	    }
	)
    }

		
    fetchUploadAndProcessURL( caller, fileURL ) {
	var corsLink = rewriteURL( caller, fileURL )
	let downloader = new Downloader( corsLink );
	let promiseDownload = downloader.downloadFile();
	let that = this;

	promiseDownload.then(
	    function(resolve) {
		that.setState( { isLoaded: true });		
		// check whether we've fetched the Shibboleth login
		if ( (resolve.text.indexOf('Shibboleth') != -1))  {
		    that.setState({showAlertShibboleth: true});
		} else {
		    console.log('UrlArea/fetchUploadAndProcessURL', resolve, resolve.text.length);
		    let newFileName = "handle.".concat(fileExtensionChooser( resolve.type ))
		    var downloadedFile = new File([resolve.text], newFileName, {type: resolve.type});
		    console.log('UrlArea/fetchUploadAndProcessURL: downloadedFile', downloadedFile);
		    let uploader = new Uploader( downloadedFile );
		    // use environment variable set in webpack config to decide which file storage server to use
		    let promiseUpload;
		    if (fileStorage === "MPCDF") {
			promiseUpload = uploader.uploadFile();
		    } else {
			promiseUpload = uploader.uploadFile_NC_B2DROP();
		    }

		    promiseUpload.then(
			function(resolve) {
			    let profiler = new Profiler( downloadedFile, "dnd", uploader.remoteFilename );
			    profiler.convertProcessFile();
			    that.setState( { loaded: true });
			},
			function(reject) {
			    console.log('DropArea.jsx/upload failed', reject);
			    alert('Error: unable to upload file');
			    that.setState( { loaded: true });		
			});
		}},
	    function(reject) {
		that.setState({showAlertURLFetchError: true} );
	    })
    }
    
    processParameters( caller, parameters ) {

	// first, reset prior history
	ResourceActions.reset();
	// this.forceUpdate();
	
	// in case, the URL is a short handle, expand 'hdl:' to 'hdl.handle.net'
	var fileURL = unfoldHandle( parameters.fileURL);
	var handleFound = fileURL.indexOf('hdl.handle.net');

	// when called from the VCR, the FCS, or B2DROP, we just get the URL, nothing else.
	if ( (caller == "VCR") || (caller == "FCS") || (caller == "B2DROP") || (caller == "D4SCIENCE") ) {
	    // fetch the resource, and profile it
	    this.fetchAndProcessURL(caller, fileURL);
	} else if (handleFound > -1) {
	    // fetch the resource, and profile it
	    // this.fetchUploadAndProcessURL(caller, fileURL);
	    // just resolve the URL
	    // this.resolveHandle( caller, fileURL );
	    var corsLink = rewriteURL( caller, fileURL )
	    let downloader = new Downloader( corsLink );
	    let promiseDownload = downloader.downloadFile();
	    let that = this;
	    promiseDownload.then(
		function(resolve) {
		    that.setState( { isLoaded: true });
		    console.log('URLArea/resolveHandle success', resolve.text)
		    fileURL = resolve.text;
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
		},
		function(reject) {
		    console.log('URLArea/resolveHandle failure', reject)		
		    that.setState({showAlertURLFetchError: true} );
		}
	    )
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
	}
//	    this.props.refreshFun();		
    }

    componentDidMount() {

	// fetch all parameter from router
	const parameters = this.props.match.params;

	// get the caller, one of VLO, VCR, FCS, or B2DROP, or D4SCIENCE
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
