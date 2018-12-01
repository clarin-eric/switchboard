// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: DropArea.jsx
// Time-stamp: <2018-12-01 14:02:23 (zinn)>
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

import BackgroundFile from './../images/file-solid.png';
import BackgroundLink from './../images/location-arrow-solid.png';
import BackgroundText from './../images/keyboard-solid.png';

export default class DropArea extends React.Component {
    constructor(props) {
	super(props);

	this.showFiles   = this.showFiles.bind(this);
	this.onDrop      = this.onDrop.bind(this);
	
	this.state = {
	    isLoaded: true,	    
	    files: [],
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
	
	this.processParameters         = this.processParameters.bind(this);
    }

    componentDidMount() {

	// fetch all parameter from router
	const parameters = this.props.match.params;

	// get the caller, one of VLO, VCR, FCS, or B2DROP, or D4SCIENCE
	const caller = this.props.caller;

	// process parameters
	this.processParameters(caller, parameters);
    }

    processParameters( caller, parameters ) {

	console.log('DropArea/processParameters', caller, parameters);	

	// when called from the VLO, these _might_ be set
	const language = parameters.fileLanguage;
	const mimeType = decodeURIComponent(parameters.fileMimetype);
	
	if ( (caller == "VCR")    || (caller == "FCS") || (caller == "VLO") || 
	     (caller == "B2DROP") || (caller == "D4SCIENCE") ) {
	    // remove prior resources
	    ResourceActions.reset();

	    // retrieve URL, and take care of 'hdl:' to be expanded 'hdl.handle.net'
	    var fileURL = unfoldHandle( parameters.fileURL);
	    var handleFound = fileURL.indexOf('hdl.handle.net');
	    
	    this.downloadAndProcessSharedLink( "VLO", fileURL);
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
	    ResourceActions.reset();
	    
	    // clear task-oriented view
	    this.props.clearDropzoneFun(); 
	    
	    this.setState({
		textInputValue : "",  // reset textarea for textual input
		files: [blob]         // put blob into file to trigger Resources
	    });

	    _paq.push(["trackEvent", 'textInput', textContent, textContent.length]);
	}
	
	event.preventDefault();
    }

    handleUrlInputSubmit(event) {
	var link = this.state.urlInputValue;
	console.log('DropArea/handleUrlInputSubmit', link, this.state);
	if ( /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/.test(link) ) {

	    // clear resources view	    
	    ResourceActions.reset();

	    // clear task-oriented view
	    this.props.clearDropzoneFun();
	    
	    this.downloadAndProcessSharedLink( "PASTE", link );	    
	    this.setState({
		urlInputValue : "",  // reset textarea for url input
		files: link
	    });
	    event.target.value = "";

	    _paq.push(["trackEvent", 'urlInput', link, link.length]);	    
	} else {
	    this.setState({showAlertURLIncorrectError: true} );		
	}	
    }
    
    handleUrlInputChange(event) {
	this.setState({urlInputValue: event.target.value});
    }


    showFiles() {

        var files = this.state.files;
        if (files.length <= 0) {
            return '';
        }

	// don't duplicate file information (apart from the preview)
	return '';

        // return React.createElement(
        //     'div',
        //     null,
        //     React.createElement(
        //         'h2',
	// 	{ className: 'resource' },		
        //         'Dropped file(s): '
        //     ),
        //     React.createElement(
        //         'ul',
	// 	{ className: 'resource' },		
        //         [].map.call(files, function (f, i) {
        //             return React.createElement(
	// 		'li',
	// 		{
        //                     key: i 
	// 		},
	// 		React.createElement('img', {
        //                     src: f.preview,
        //                     width: 100 
	// 		}),
	// 		React.createElement(
	// 		    'div',
	// 		    null,
	// 		    f.name + ' : ' + f.size + ' bytes.'
	// 		)
        //             );
        //         })
        //     )
        // );
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
    downloadAndProcessSharedLink( caller, link ) {
	this.setState( { isLoaded: false });
	let downloader = new Downloader( link );
	let promiseDownload = downloader.downloadBlob();
	let that = this;
	promiseDownload.then(
	    function(resolve) {
		console.log('DropArea.jsx/downloadAndProcessSharedLink succeeded', resolve);
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
	let that = this;
	let tthat = this;
	let uploader = new Uploader( {file: currentFile, type: type} );

	console.log('DropArea/uploadAndProcessFile', currentFile, that);
	let promiseUpload = uploader.uploadFile();
	
	promiseUpload.then(
	    function(resolve) {
		let profiler = new Profiler( currentFile,
					     "dnd",
					     uploader.remoteFilename,
					     () => tthat.setState( {showAlertMissingInfo: true} )
					   );
		profiler.convertProcessFile();
		that.setState( { isLoaded: true });
	    },
	    function(reject) {
		console.log('DropArea.jsx/upload failed', reject);
		that.setState({showAlertURLUploadError: true} );				
		that.setState( { isLoaded: true });		
	    });
    }   
    
    onDrop(files) {

	// clear resources view
	if (files.length > 0) {
	    ResourceActions.reset();
	}	

	// clear task-oriented view
	this.props.clearDropzoneFun();
	
	// process the file(s)
	for (var i=0; i<files.length; i++) {
	    this.uploadAndProcessFile( {currentFile: files[i]} );	    
	}

	// set the state
	// CZ: check whether no longer needed
	this.setState({
	    files: files
	});

	_paq.push(["trackEvent", 'fileInput', files[0].name]);
    }

    render() {

	const { isLoaded } = this.state;		
	const transferalInfoStyle = {
	    fontSize: '0.5em',
	    margin: 2,
	    padding: 2	    
	};
		
	const transferalInfo = `Resource transferal from ${this.props.caller}. Please check the information below, then press "Show Tools"`;

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

	// when invoked via VLO/B2DROP/D4Science/etc, we don't show the 3 areas for dropping resources
	if ( this.props.caller == "standalone" ) {
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
		      <td>
			<div className="relativeDiv">
			  <form onSubmit={this.handleUrlInputSubmit}>
			    <TextareaAutosize rows={5}
					      maxRows={5}
					      style={styleTextareaLink}
		                              value={this.state.urlInputValue}
					      onChange={this.handleUrlInputChange}
					      placeholder='Paste the URL of the file to process.' >
			    </TextareaAutosize>
			    <input className="inputAbsolute" type="submit" value="Submit URL"/>
			  </form>
			</div>			  
		      </td>
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
		{this.showFiles()}
		</div>
	    )	    
	} else {
	    return (
	       <Loader loaded={isLoaded}>
		<h2>
		   <div style={transferalInfoStyle} >
		     {transferalInfo}
                   </div>
		</h2>
		{this.state.showAlertShibboleth ?
    		 <AlertShibboleth onCloseProp={ () => this.setState( {showAlertShibboleth: false} ) } />
		 : null }

	        {this.state.showAlertURLFetchError ?
		 <AlertURLFetchError onCloseProp={ () => this.setState( {showAlertURLFetchError: false} ) } />
		 : null }

	        {this.state.showAlertURLIncorrectError ?
		 <AlertURLIncorrectError onCloseProp={ () => this.setState( {showAlertURLIncorrectError: false} ) } />		 
		 : null }				

	        {this.state.showAlertMissingInputText ?
		 <AlertMissingInputText onCloseProp={ () => this.setState( {showAlertMissingInputText: false} ) } />
		 : null }

	        {this.state.showAlertMissingInfo ?
		 <AlertMissingInfo onCloseProp={ () => this.setState( {showAlertMissingInfo: false} ) } />
		 : null }
		
	        {this.state.showAlertURLUploadError ?
		 <AlertURLUploadError onCloseProp={ () => this.setState( {showAlertURLUploadError: false} ) } />
		 : null }	    
               </Loader>		    
	    )
	}
    }
}
