// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
//
// File: DropArea.jsx
// Time-stamp: <2019-04-29 11:31:00 (zinn)>
// -------------------------------------------

import React from 'react';
import Loader from 'react-loader';
import Dropzone from 'react-dropzone';
import TextareaAutosize from 'react-autosize-textarea';
import ReactTooltip from 'react-tooltip';
import Request from 'superagent';

import AlertURLFetchError from './AlertURLFetchError.jsx';
import AlertURLIncorrectError from './AlertURLIncorrectError.jsx';
import AlertURLUploadError from './AlertURLUploadError.jsx';
import AlertShibboleth from './AlertShibboleth.jsx';
import AlertMissingInfo from './AlertMissingInfo.jsx';
import AlertMissingInputText from './AlertMissingInputText.jsx';
import UserFAQ from './UserFAQ.jsx';                // component displaying user faq

import MatcherRemote from '../back-end/MatcherRemote';
import {processLanguage, unfoldHandle} from '../back-end/util';

// not used yet; might replace or add to drop boxes as background image
import BackgroundFile from './../images/file-solid.png';
import BackgroundLink from './../images/location-arrow-solid.png';
import BackgroundText from './../images/keyboard-solid.png';
import uuidv4 from 'uuid/v4';

export default class DropArea extends React.Component {
    constructor(props) {
        super(props);

        // passed from main component to allow trash bin to clear task oriented view
        this.handleToolsChange     = props.onToolsChange;
        this.handleResourcesChange = props.onResourcesChange;

        console.log('DropArea', props);
        this.onDrop      = this.onDrop.bind(this);
        this.getPermissableMimetypes = this.getPermissableMimetypes.bind(this);
        this.getPermissableLanguages = this.getPermissableLanguages.bind(this);

        this.state = {
            isLoaded: true,
            mimetypes : [],
            languages : [],

            textInputValue: "",
            urlInputValue: "",

            // for disabled/enabling the 3 drop zone areas
            textInputAreaRef: "",
            urlInputAreaRef: "",
            fileInputAreaRef: "",

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

        this.processStorageResponse = this.processStorageResponse.bind(this);
        this.processStorageResponseError = this.processStorageResponseError.bind(this);
    }

    componentDidMount() {

        // fetch all parameter from router
        const parameters = this.props.match.params;

        // process parameters
        this.processParameters(this.props.caller, parameters);

        // set state for permissable mediatypes
        this.getPermissableMimetypes();

        // set state for permissable languages
        this.getPermissableLanguages();
    }

    processParameters( caller, parameters ) {

        console.log('DropArea/processParameters', caller, parameters);

        const KNOWN_CALLERS = new Set(["VCR", "FCS", "VLO", "TEXTGRID", "B2SHARE", "B2DROP", "D4SCIENCE"]);
        if (KNOWN_CALLERS.has(caller)) {
            // remove prior resources
            this.handleResourcesChange( undefined );

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
            blob.name = "Submitted Text.txt";
            this.uploadAndProcessFile(blob, 'blob');

            // clear task-oriented view
            this.clearDropzone();

            _paq.push(["trackEvent", 'textInput', textContent, textContent.length]);
        }

        event.preventDefault();
    }

    clearDropzone() {
        console.log('DropArea/clearDropzone', this.state);

        this.setState({ urlInputValue : "", textInputValue : "" });

        // signal to parent that tool list is empty
        this.handleToolsChange( [] );

        // delete old resource(s)
        this.handleResourcesChange( undefined );

        // manipulate the history (todo: does not work)
        this.props.history.push("/");
    }

    handleUrlInputSubmit(event) {
        var link = this.state.urlInputValue;
        console.log('DropArea/handleUrlInputSubmit', link, this.state);
        if ( /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/.test(link) ) {

            // clear task-oriented view
            this.clearDropzone();

            this.downloadAndProcessSharedLink( link );

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

        const res = {
            type      : 'link',
            language  : processLanguage(),
        };
        this.handleResourcesChange(res);
        Request
            .post(window.APP_CONTEXT_PATH + "/api/storage/")
            .field({link})
            .accept('json')
            .then(this.processStorageResponse.bind(this, res), this.processStorageResponseError);
    }

    /// type is 'file' or 'blob'
    uploadAndProcessFile(currentFile, type) {
        this.setState( { isLoaded: false });

        const res = {
            type      : type,
            file      : currentFile,
            filename  : currentFile.name,
            mediatype : currentFile.type,
            language  : processLanguage(),
        };
        this.handleResourcesChange(res);
        Request
            .post(window.APP_CONTEXT_PATH + "/api/storage/")
            .attach('file', res.file, res.name)
            .accept('json')
            .then(this.processStorageResponse.bind(this, res), this.processStorageResponseError);
    }

    processStorageResponse(res, response) {
        console.log('DropArea uploadAndProcessFile resource: ', res);
        console.log('DropArea uploadAndProcessFile response: ', response);

        // assign id, url, mediatype, length, language
        Object.assign(res, response.body);
        res.language = processLanguage(response.body.language);

        // todo: remove these entries from the rest of js code
        res.name = res.filename;
        res.mimetype = res.mediatype;
        res.remoteFilename = res.filename;

        if (res.localLink && res.localLink.startsWith(window.APP_CONTEXT_PATH + '/api')) {
            res.localLink = window.origin + res.localLink;
            console.log("res.localLink: ", res.localLink);
        }

        this.handleResourcesChange(res);
        if ( (res.mimetype == "application/zip") ||
             (res.mimetype == "application/x-gzip") ) {
            // todo: acknowledge that a zip file has been received, but that a manual identification
            //        of its parts wrt. language should be made by the user.
            this.setState({isLoaded: true, showAlertMissingInfo: true});
        } else if ( (res.mimetype == "audio/vnd.wave") ||
                    (res.mimetype == "audio/x-wav")    ||
                    (res.mimetype == "audio/wav")      ||
                    (res.mimetype == "audio/mp3")      ||
                    (res.mimetype == "audio/mp4")      ||
                    (res.mimetype == "audio/x-mpeg")) {
            this.setState({showAlertMissingInfo: true});
        } else {
            this.setState({isLoaded: true});
        }
    }

    processStorageResponseError(error) {
        console.error('Error getting resource in storage:', error);
        this.setState({showAlertURLUploadError: true, isLoaded: true});
        this.clearDropzone();
    }

    getPermissableMimetypes() {
        const matcher = new MatcherRemote( true );
        const mediatypePromise = matcher.getSupportedMimetypes();
        mediatypePromise.then(
            (resolve) => {
                this.setState( {mimetypes: resolve} );
            },
            (reject) => {
                console.log('DropArea.jsx/getPermissableMimetypes failed', reject);
            });
    }

    getPermissableLanguages() {
        const matcher = new MatcherRemote( true );
        const languagePromise = matcher.getSupportedLanguages();

        languagePromise.then(
            (resolve) => {
                this.setState( {languages: resolve} );
            },
            (reject) =>  {
                console.log('DropArea.jsx/getPermissableLanguages failed', reject);
            });
    }

    // for time being, only single file is accepted (multiple=false)
    onDrop(acceptedFiles, rejectedFiles) {
        console.log('DropArea/onDrop', acceptedFiles, rejectedFiles);

        // deal with rejected files
        if (rejectedFiles.length) {
            console.log("A file was rejected", rejectedFiles.length, rejectedFiles[0].name)
            this.setState( {showAlertURLUploadError: true} );
            _paq.push(["trackEvent", 'fileInputRejected', rejectedFiles[0].name]);
            // todo: show more proper message to users that some files were rejected
            return;
        }

        // clear dropzone and hence its task-oriented view
        this.clearDropzone();

        // process the file(s)
        for (var i=0; i<acceptedFiles.length; i++) {
            this.uploadAndProcessFile(acceptedFiles[i]);
        }

        _paq.push(["trackEvent", 'fileInput', acceptedFiles[0].name]);
    }


    render() {

        // when invoked via VLO/B2DROP/D4Science/etc, we add transferal info to the middle box
        const transferalInfo = `Resource transferal from ${this.props.caller}. Please check the information below, then press "Show Tools"`;

        // console.log('DropArea/render', this.state.isLoaded, this.props.caller);
        _paq.push(["trackEvent", 'enterSwitchboard', this.props.caller]);

        const styleDropzone = {
            borderWidth: 2,
            borderRadius: 4,
            margin: 10,
            padding: 10,
            width: 248,
            height:100,
            resize: 'none',
            transition: 'all 0.5s',
            display:'inline-block'
        };

        const disabledStyleDropzone = {
            color: 'grey',
            borderColor: 'grey',
            borderStyle: 'dashed'
        }


        const enabledStyleDropzone = {
            color: 'black',
            borderColor: 'black',
            borderStyle: 'solid'
        }

        const textColor = {
            color: 'grey'
        }

        // when a file is dragged over the dropzone (left box), that's the style being used
        const activeStyleDropzone = {
            borderStyle: 'solid',
            backgroundColor: '#eee',
            borderRadius: 8
        };

        // "text/plain, application/pdf"
        const permissableMimetypes = [...this.state.mimetypes].toString();

        console.log('Permissable mimetypes: ', permissableMimetypes);

        const styleState = this.props.caller == "standalone" ? enabledStyleDropzone  : disabledStyleDropzone;
        const disabled = this.props.caller !== "standalone";

        return (
              <div>
                <h3 id="dropAreaHeading">Input</h3>
                <div className="dropAreaTable">
                  <p>The Switchboard helps you find tools that can process your resources. Use one of the three boxes below to upload your data.
                    <br />Your data will be shared with the tools via public links. For more details, see the {' '}
                    <UserFAQ className="header-link" />.
                   </p>
                </div>
                <Loader loaded={this.state.isLoaded} />
                <table className="dropAreaTable">
                  <tbody>
                    <tr>
                      <td>
                        <Dropzone className="inputZone"
                                  multiple={false}
                                  onDrop={this.onDrop}
                                  maxSize={5000000}
                                  accept = {permissableMimetypes}
                                  disabled={disabled}
                                  style={{...styleDropzone, ...styleState, ...textColor}}
                                  activeStyle={activeStyleDropzone} >
                          Drop your file, or click to select the file to upload.
                        </Dropzone>
                      </td>
                      <td>
                        <div className="relativeDiv">
                          <form onSubmit={this.handleUrlInputSubmit}>
                            <TextareaAutosize className="inputZone"
                                              rows={5}
                                              disabled={disabled}
                                              maxRows={5}
                                              style={ {...styleDropzone, ...enabledStyleDropzone} }
                                              value={this.props.caller == "standalone" ? this.state.urlInputValue : transferalInfo}
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
                          <TextareaAutosize className="inputZone"
                                            rows={5}
                                            disabled={disabled}
                                            maxRows={5}
                                            style={{...styleDropzone, ...styleState} }
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
