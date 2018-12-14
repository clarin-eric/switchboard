// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: DropArea.jsx
// Time-stamp: <2018-12-14 14:24:21 (zinn)>
// -------------------------------------------

import React from 'react';
import Loader from 'react-loader';
import Dropzone from 'react-dropzone';
import ResourceActions from '../actions/ResourceActions';
import TextareaAutosize from 'react-autosize-textarea';
import AlertURLFetchError from './AlertURLFetchError.jsx';
import AlertURLIncorrectError from './AlertURLIncorrectError.jsx';
import AlertURLUploadError from './AlertURLUploadError.jsx';
import AlertShibboleth from './AlertShibboleth.jsx';
import AlertMissingInfo from './AlertMissingInfo.jsx';
import AlertMissingInputText from './AlertMissingInputText.jsx'; 

import Resolver from '../back-end/Resolver';
import Profiler from '../back-end/Profiler';
import Uploader from '../back-end/Uploader';
import Downloader from '../back-end/Downloader';
import {fileExtensionChooser, processLanguage, unfoldHandle} from '../back-end/util';

// not used yet; might replace or add to drop boxes as background image
import BackgroundFile from './../images/file-solid.png';
import BackgroundLink from './../images/location-arrow-solid.png';
import BackgroundText from './../images/keyboard-solid.png';

import FadeProps from 'fade-props';

export default class DropArea extends React.Component {
    constructor(props) {
	super(props);

	// passed from main component to allow trash bin to clear task oriented view
	this.handleToolsChange = props.passToolsChangeToParent;
	
	console.log('DropArea', props);
	this.onDrop      = this.onDrop.bind(this);
	
	this.state = {
	    isLoaded: true,
	    textInputValue: "",
	    urlInputValue: "",	    
	    showAlertShibboleth: false,	    
	    showAlertURLFetchError: false,
	    showAlertURLIncorrectError: false,
	    showAlertURLUploadError: false,
	    showAlertMissingInputText: false,
	    showAlertMissingInfo: false
	};
	
	this.handleTextInputChange   = this.handleTextInputChange.bind(this);
	this.handleTextInputSubmit   = this.handleTextInputSubmit.bind(this);
	
	this.handleUrlInputChange   = this.handleUrlInputChange.bind(this);
	this.handleUrlInputSubmit   = this.handleUrlInputSubmit.bind(this);
	
	this.processParameters      = this.processParameters.bind(this);
	this.clearDropzone          = this.clearDropzone.bind(this);
    }

    componentDidMount() {

	// fetch all parameter from router
	const parameters = this.props.match.params;

	// process parameters
	this.processParameters(this.props.caller, parameters);

    }

    processParameters( caller, parameters ) {

	console.log('DropArea/processParameters', caller, parameters);	

	/* Change in policy:

	   parameters.fileLanguage 
	   parameters.fileMimetype

	   now ignored. Our own Apache Tika takes care of this

	*/
	
	if ( (caller == "VCR")    || (caller == "FCS") || (caller == "VLO") || 
	     (caller == "B2DROP") || (caller == "D4SCIENCE") ) {
	    // remove prior resources
	    ResourceActions.reset();

	    // some minor treatment for hdl: in the fileURL
	    var fileURL = unfoldHandle( parameters.fileURL);
	    
	    this.downloadAndProcessSharedLink( fileURL);
	}
    }
   
    handleTextInputChange(event) {
	this.setState({textInputValue: event.target.value});
    }

    // todo: check minimum number of bytes that need to be submitted.
    handleTextInputSubmit(event) {
	var textContent = this.state.textInputValue;

	console.log('DropArea/handleTextInputSubmit', textContent, this.state);		
	if (textContent == "") {
	    this.setState({showAlertMissingInputText: true} );			    
	} else {

	    var blob = new Blob([textContent], {type: "text/plain"});
	    this.uploadAndProcessFile( {currentFile: blob, type: 'data'} );
	    
	    // remove prior resources
	    // ResourceActions.reset();
	    
	    // clear task-oriented view
	    // this.props.history.push("/");
	    this.clearDropzone();

	    // reset textarea for textual input	    
	    this.setState({ textInputValue : "" });

	    _paq.push(["trackEvent", 'textInput', textContent, textContent.length]);
	}

	event.preventDefault();
    }

    clearDropzone() {
	console.log('DropArea/clearDropzone', this.state);

	// signal to parent that tool list is empty
	this.handleToolsChange( [] );
	
	// check whether necessary for cache busting	
	localStorage.removeItem("app"); 

	// delete old resource 
	ResourceActions.reset();

	// manipulate the history
	this.props.history.push("/");
    }

    handleUrlInputSubmit(event) {
	var link = this.state.urlInputValue;
	console.log('DropArea/handleUrlInputSubmit', link, this.state);
	if ( /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/.test(link) ) {

	    // clear resources view	    
	    // ResourceActions.reset();

	    // clear task-oriented view
	    // this.props.history.push("/");
	    // this.props.clearDropzoneFun();
	    this.clearDropzone();
	    
	    
	    this.downloadAndProcessSharedLink( link );

	    // reset textarea for url input	    
	    this.setState({ urlInputValue : "" });
	    
	    event.target.value = "";

	    _paq.push(["trackEvent", 'urlInput', link, link.length]);	    
	} else {
	    this.setState({showAlertURLIncorrectError: true} );		
	}	
    }
    
    handleUrlInputChange(event) {
	this.setState({urlInputValue: event.target.value});
    }

    /* 
       Originally, the PASTE facility was advertised for Dropbox/B2DROP users (coming from known locations).
       Here, URL was rewritten and reverse-proxyied by nginx to tackle CORS-related issues.

       Now, users are allowed to paste arbitrary links. The switchboard uploads each file to its
       storage space, which is hosted on the same domain than the switchboard. Hence, all tools
       connected to the switchboard can download the resource from this location without running
       into CORS issues. 

       Note that the behaviour is extended to switchboard invocations from the VLO, VCR, FCS, B2DROP, D4SCIENCE.

     */
    downloadAndProcessSharedLink( link ) {
	this.setState( { isLoaded: false });
	let downloader = new Downloader( link );
	let promiseDownload = downloader.downloadBlob();
	let that = this;
	promiseDownload.then(
	    function(resolve) {
		let file = new File([resolve.body], resolve.req.url, {type: resolve.type});
		that.uploadAndProcessFile( {currentFile: file, type: 'file'} );		
		that.setState( { isLoaded: true });
	    },
	    function(reject) {
		console.log('DropArea.jsx/downloadAndProcessSharedLink failed', reject);
		that.setState( {showAlertURLFetchError: true} );		
		that.setState( { isLoaded: true });
	    });
    }   

    uploadAndProcessFile( { currentFile, type = 'file' } = {} ) {

	this.setState( { isLoaded: false });
	let thatThis = this;
	let uploader = new Uploader( {file: currentFile, type: type} );

	console.log('DropArea/uploadAndProcessFile', currentFile, thatThis);
	let promiseUpload = uploader.uploadFile();
	
	promiseUpload.then(
	    function(resolve) {
		let profiler = new Profiler( currentFile,
					     "dnd",
					     uploader.remoteFilename,
					     () => thatThis.setState( {showAlertMissingInfo: true} )
					   );
		profiler.convertProcessFile();
		thatThis.setState( { isLoaded: true });
	    },
	    function(reject) {
		console.log('DropArea.jsx/upload failed', reject);
		thatThis.setState({showAlertURLUploadError: true} );				
		thatThis.setState( { isLoaded: true });		
	    });
    }   
    
    onDrop(files) {

	// clear resources view
	if (files.length > 0) {
	    ResourceActions.reset();
	}	

	// clear dropzone and hence its task-oriented view
	// this.props.history.push("/");	
	// this.props.clearDropzoneFun();
	this.clearDropzone();
	
	// process the file(s)
	for (var i=0; i<files.length; i++) {
	    this.uploadAndProcessFile( {currentFile: files[i]} );	    
	}

	_paq.push(["trackEvent", 'fileInput', files[0].name]);
    }

    render() {

	console.log('DropArea/render', this.state);

	// when invoked via VLO/B2DROP/D4Science/etc, we add transferal info to the middle box
	const transferalInfo = `Resource transferal from ${this.props.caller}. Please check the information below, then press "Show Tools"`;
	/*
	if (! ( this.props.caller == "standalone" )) {
				      
	    this.setState( { urlInputValue: transferalInfo })
	};
	*/
	
	const { isLoaded } = this.state;		
	const transferalInfoStyle = {
	    fontSize: '0.5em',
	    margin: 2,
	    padding: 2	    
	};

	console.log('DropArea/render', isLoaded, this.state.isLoaded, this.props.caller);
	_paq.push(["trackEvent", 'enterSwitchboard', this.props.caller]); 	    		
	
        var styleDropbox = {
            borderWidth: 2,
            borderColor: 'black',
            borderStyle: 'dashed',
            borderRadius: 4,
            margin: 10,
            padding: 10,
            width: 248,
	    height:100,
	    resize: 'none',
	    transition: 'all 0.5s',
	    display:'inline-block'
	};

        var styleTextareaLink = {
            borderWidth: 2,
            borderColor: 'black',
            borderStyle: 'dashed',
            borderRadius: 4,
	    backgroundImage: "url(" + BackgroundLink + ")",
	    backgroundPosition: 'bottom right',
	    backgroundRepeat: 'no-repeat',
            margin: 10,
            padding: 10,
            width: 248,
	    height:100,
	    resize: 'none',
	    transition: 'all 0.5s',
	    display:'inline-block'
        };

        var styleTextareaText = {
            borderWidth: 2,
            borderColor: 'black',
            borderStyle: 'dashed',
            borderRadius: 4,
	    backgroundImage: 'location-arrow-solid.png',
	    backgroundPosition: 'bottom right',
	    backgroundRepeat: 'no-repeat',
            margin: 10,
            padding: 10,
            width: 248,
	    height:100,
	    resize: 'none',
	    transition: 'all 0.5s',
	    display:'inline-block'
        };
	

        var activeStyleDropbox = {
            borderStyle: 'solid',
            backgroundColor: '#eee',
            borderRadius: 8
        };

	var parStyle = {
	    width: 600,
	    margin: 10,
	    padding: 10
	}

	return (
	      <div>
 	        <h3 id="dropAreaHeading">Provision of Input</h3>
		<Loader loaded={this.state.isLoaded} />
		<table className="dropAreaTable">
		  <tbody>
		    <tr>
		      <td>
			<Dropzone onDrop={this.onDrop}
				  style={styleDropbox}
				  activeStyle={activeStyleDropbox} >
			  Drop your file, or click to select the file to upload.
			</Dropzone>
		      </td>
		      <FadeProps animationLength={this.props.caller == "standalone" ? 1 : 1000} direction={0} >
		      <td>
			<div className="relativeDiv">
			  <form onSubmit={this.handleUrlInputSubmit}>
			    <TextareaAutosize rows={5}
					      maxRows={5}
					      style={styleTextareaLink}
		                              value={this.props.caller == "standalone" ? this.state.urlInputValue : transferalInfo}
					      onChange={this.handleUrlInputChange}
					      placeholder='Paste the URL of the file to process.' >
			    </TextareaAutosize>
			    <input className="inputAbsolute" type="submit" value="Submit URL"/>
			  </form>
			</div>			  
		      </td>
		      </FadeProps>
		      <td>
			<div className="relativeDiv">
			<form onSubmit={this.handleTextInputSubmit}>
			  <TextareaAutosize rows={5}
					    maxRows={5}
					    style={styleTextareaText}
					    value={this.state.textInputValue}
					    onChange={this.handleTextInputChange}
					    placeholder='Enter your text to be processed here.' >
			  </TextareaAutosize>
			  <input className="inputAbsolute" type="submit" value="Submit Text"/>
			</form>
			</div>
		      </td>
		      <td>
			<div>
                          <span onClick={ () => this.clearDropzone()} >
                            <i className="fa fa-trash fa-3x" aria-hidden="true" >
			    </i>
                          </span>
			</div>
		      </td>
		    </tr>
		  </tbody>
  		</table>
		{this.state.showAlertShibboleth ?
    		 <AlertShibboleth        onCloseProp={ () => this.setState( {showAlertShibboleth: false} ) } />
		 : null }
	        {this.state.showAlertURLFetchError ?
		 <AlertURLFetchError     onCloseProp={ () => this.setState( {showAlertURLFetchError: false} ) }/>
		 : null }
	        {this.state.showAlertURLIncorrectError ?
		 <AlertURLIncorrectError onCloseProp={ () => this.setState( {showAlertURLIncorrectError: false} ) } />
		 : null }
	        {this.state.showAlertMissingInputText ?
		 <AlertMissingInputText  onCloseProp={ () => this.setState( {showAlertMissingInputText: false} ) } />
		 : null }
	        {this.state.showAlertMissingInfo ?
		 <AlertMissingInfo       onCloseProp={ () => this.setState( {showAlertMissingInfo: false} ) } />
		 : null }
	        {this.state.showAlertURLUploadError ?
		 <AlertURLUploadError    onCloseProp={ () => this.setState( {showAlertURLUploadError: false} ) } />
		 : null }
		</div>
	);
    }
}
