// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: UserHelp.jsx
// Time-stamp: <2018-09-21 09:52:14 (zinn)>
// -------------------------------------------

import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import {emailContactCommand} from './../back-end/util';

export default class UserHelp extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  }
  state = {
    showModal: false,
  }
  openModal = () => {
    this.setState({showModal: true});
  }
  closeModal = () => {
    this.setState({showModal: false});
  }
  render() {
    return <a className={this.props.className} onClick={this.openModal}>
      Help
      {this.state.showModal ?
        <UserHelpText onClose={this.closeModal}/>
      : null}
    </a>;
  }
}

class UserHelpText extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
  }
  render() {
    return <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} className="userHelpDialog"  width={800} margin={50}>
	    <h2>How to use the Language Resource Switchboard</h2>
	  <p>Currently, there are two versions of the Language Resources Switchboard (LRS): the standalone version,
	    where users can drag and drop their own resources from the file system into the LRS drop area, and the VLO version,
	    where users can call the LRS for a selected resource from the Virtual Language Observatory. This
	    document describes the standalone version, but it is as well applicable for the VLO version once the
	    LRS has been called with a <em>single</em> resource. </p>


	  <h3>Usage:</h3>
	  <ol>
	    <li>Drag a file from your file manager to the dotted area in the screen. Alternatively, click
	      on the dotted area, then select a file to be uploaded. <small>[Note that the selected file will be
		uploaded to a temporary file storage onto a CLARIN-based server. The temporary file storage is not secure, that is, other users might get access to your file.]</small></li>
	    <li>Alternatively, two more input methods are available now:
	      <ul>
		<li>Paste a shared link from your Dropbox or B2DROP account into the middle box. In
		fact, any URL that directly refers to a resource will do. The switchboard will attempt to
		download the file and determine its media type and language</li>
		<li>Type any text into the right-most dotted area. Your text will be saved into a
		file. Please use this input for plain text only.</li>
	      </ul>
	    </li>
	    <li>A file information pane appears with basic information about the file. Please verify
	      whether the information that has been gathered in the pane is correct. Use the pull-down menus
	      for 'mimetype' and 'language' to correct existing information, or to add missing
	      information. Both language and mimetype must be supplied before the next step.</li>
	    <li>In the file info pane, click on 'Show Tools'. The 'Task Oriented View' should now show a
	      list of applicable tools capable of processing the resource in question. The tools are
	      ordered, given the task they perform.</li>
	    <li>Click on a tool of interest to get additional information about the selected tool.</li>
	    <li>Click on 'Click to start tool' to open the selected tool in a new browser tab.</li>
	    <ul>
	      <li>a reference to your resource as well as its mimetype and language is being passed onto the tool.</li>
	      <li>some tools require a login/password. You may need to register with tool providers before you can use a given tool.</li>
	    </ul>
	    <li>Drag and drop (or select) another file into the dotted area will restart the aforementioned process.</li>
	  </ol>
	  
	  <h3>Mind the gap (for VLO transferrals)</h3>
	  
	  When the LRS is called from the VLO, please keep in mind that the resource of interest
	  <ul>
	    <li>may have an different mimetype than advertised, or </li>
	    <li>may be only accessible after user authentication, or</li>
	    <li>may be accessible to you, but not necessarily accessible to the tools that the LRS is
	      suggesting for processing the resource.</li>
	    <li>It may also be possible that the handle of the resource is pointing to a viewer application that shows
	      the resource, rather than directly linking to the resource.</li>
	  </ul>
	  If the tool suggested by the LRS has problems processing the resource of interest, please
	  consider downloading the resource from the resource provider (an authentication may be
	  required). Then save the resource to your harddrive, and use
	  the <a href="https://switchboard.clarin.eu">standalone version of the LRS. </a>
	    Before uploading the resource, check whether the resource matches the mimetype you expect.
	    
	  <h3>Mind the gap (General Remarks)</h3>
	  <ul>
	    <li>For the processing of a large file, please keep in mind that its uploading to the server
	      may take some time. Also, the LRS methods for the identification of the language and
	      mimetype of a resource may take its time toll.</li>
	    <li>For the processing of a large file, please also keep in mind that many tools may have a
	      restriction that the LR Switchboard is currently unaware of. For instance, the WebLicht
	      workflow engine currently permits the processing of files less than 3 MB.</li>
	    <li>The LRS now also shows <em>web services</em>. This is experimental. When 'Click to start
	      tool' is pressed, the web service is being called. Upon completion (which may take some
	      time), a new tab opens with the response of the web services. The response either holds the
	      processed data, or a reference to a location where it can be downloaded from. Sometimes,
	      the response also holds metadata about the processing.</li>
	    <li>At the time of writing, only a single resource can be processed; 
	      We are working on a procedure to process two files at once (for tools that require
	      two inputs) </li>
	    <li><em>Please contact us, when a tool (or web service) does not work as advertised, or when you
		would like to have some tool (or web service) added to the LRS.</em></li>
	    <li><em>By visiting our site, users accept the use of cookies by Piwik and Google
		Analytics to make visits statistics.</em></li>
	  </ul>
	  
	  <h3>Frequently Asked Questions</h3>
	  <ul>
	    <li>
	      <em>Q: Is there a way to perform a batch processing of files?</em>
	      <p>
		A: The switchboard is not able to batch processing many documents itself. It can,
		however, invoke a tool capable of batch processing. At the time of writing, there is
		a single tool connected to the switchboard that can batch process documents:
		"WebSty". To invoke WebSty, upload a zip archive of Polish plain text files and
		follow the instructions.
	      </p>	      
	    </li>
	    <li>
	      <em>Q: Is there a way for the switchboard to run tools in a pipeline?</em>
	      <p>
		A: The switchboard is not a workflow engine. It can, however, invoke a tool capable
		of executing pipelines.  In fact, there are many tools connected to the switchboard
		that offer predefined pipelines. The WebLicht workflow engine, for instance, has
		multiple switchboard entries advertising to perform complex analyses such as
		constituency parsing or named entity recognition. To perform these tasks, WebLicht
		makes use of predefined pipelines and orchestrates the execution of them (feeding
		the output of one tool to the input of the following tool). There is also the Dutch
		NLP suite "Frog". Once the switchboard directed users with their resource to the
		FROG site, users can activate or deactivate various analyses.
	      </p>	      	      
	    </li>
	    <li>
	      <em>Q: I don't see many well-known tools in the switchboard. Where, for instance, are the NLP tools from Stanford?</em>
	      <p>	      
		A: At the time of writing, the Stanford tools are not <em>directly</em> callable from the
		switchboard. Remember, to connect a tool to the switchboard, the tool developers have to
		perform some integration work (for details, see "For Developers"). However, well-known tools work
		under the hood of WebLicht.  The WebLicht entry for Constituent Parsing, for example,  makes use
		of the Stanford Tokenizer and the Charniak parser. Also note that the switchboard will
		continue to integrate more tools <em>directly</em>into the switchboard. And we explicitly ask
		developers to adapt their tools so that they are callable via the switchboard.
	      </p>	      	      
	    </li>
	    <li>	      
	      <em>Q: Your question comes here</em>
	    </li>
	  </ul>
          <hr />
	  <p>
	      
	      Please contact the <a href={ emailContactCommand }>Switchboard Team</a>.
	      Alternatively, you can also contact the German CLARIN 
	      
	      <a href="https://support.clarin-d.de/mail/?lang=de&QueueID=19&ResponsibleID=15&OwnerID=15" target="_blank">
		<img className="alignRight" src="button_helpdesk_forhelp.png" width="10%" height="10%" />
	      </a>
	    </p>
        </ModalDialog>
    </ModalContainer>;
  }
}

