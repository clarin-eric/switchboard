import React, {PropTypes} from 'react';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

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
  state = {
    showSecondModal: false
  }
  openModal = () => {
    this.setState({showSecondModal: true});
  }
  closeModal = () => {
    this.setState({showSecondModal: false});
  }
  render() {
    return <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} className="userHelpDialog"  width={800} height={400}>
          {this.state.showSecondModal ?
            <SecondModal onClose={this.closeModal}/>
          : null}

	    <h2>How to use the Language Resource Switchboard</h2>
	    <center><p><small><b><em>Leave Help with ESC</em></b></small></p></center>
	  <p>Currently, there are two versions of the Language Resources Switchboard (LRS): the standalone version,
	    where users can drag and drop their own resources from the file system into the LRS drop area, and the VLO version,
	    where users can call the LRS for a selected resource from the Virtual Language Observatory. This
	    document describes the standalone version, but it is as well applicable for the VLO version once the
	    LRS has been called with a <em>single</em> resource. </p>


	  <h3>Usage:</h3>
	  <ol>
	    <li>Drag a file from your file manager to the dotted area in the screen. Alternatively, click
	      on the dotted area, then select a file to be uploaded. <small>[Note that the selected file will be
		uploaded to a temporary file storage onto a CLARIN-based server.]</small></li>
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
	    <li>may be only accessible after user authentification, or</li>
	    <li>may be accessible to you, but not necessarily accessible to the tools that the LRS is
	      suggesting for processing the resource.</li>
	    <li>It may also be possible that the resource's handle is pointing to a viewer application that shows
	      the resource, rather than directly linking to the resource.</li>
	  </ul>
	  If the tool suggested by the LRS has problems processing the resource of interest, please
	  consider downloading the resource from the resource provider (an authentification may be
	  required). Then save the resource to your harddrive, and use
	  the <a href="http://weblicht.sfs.uni-tuebingen.de/clrs">standalone version of the LRS.</a>
	    Before uploading the resource, check whether the resource matches the mimetype you expect.
	    
	    <h3>Mind the gap (General Remarks)</h3>
	    <ul>
	      <li>For the processing of a large file, please keep in mind that its uploading to the server
		may take some time. Also, the LRS methods for the identification of a resource's language and
		mimetype may take its time toll.</li>
	      <li>For the processing of a large file, please also keep in mind that many tools may have a
		restriction that the LR Switchboard is currently unaware of. For instance, the WebLicht
		workflow engine currently permits the processing of files less than 3 MB.</li>
	      <li>The LRS now also shows <em>web services</em>. This is experimental. When 'Click to start
		tool' is pressed, the web service is being called. Upon completion (which may take some
		time), a new tab opens with the web services' response. The response either holds the
		processed data, or a reference to a location where it can be downloaded from. Sometimes,
		the response also holds metadata about the processing.</li>
	      <li>At the time of writing, only a single resource can be processed; there is no batch
		processing of resources, or a procedure to process two files at once (for tools that require
		two inputs) </li>
	      <li><em>Please contact us, when a tool (or web service) does not work as advertised, or when you
		  would like to have some tool (or web service) added to the LRS.</em></li>
	    </ul>
	    <p>
	      <hr />
	      
	      Please contact: <a href="mailto:claus.zinn@uni-tuebingen.de?subject=CLARIN-PLUS LRS">Claus Zinn</a>.
	      Alternatively, you can also contact the German CLARIN 
	      
	      <a href="https://support.clarin-d.de/mail/?lang=de&QueueID=19&ResponsibleID=15&OwnerID=15" target="_blank" onclick="return popup_CLARIN_HELPDESK(this.href)">
		<img className="alignRight" src="button_helpdesk_forhelp.png" width="10%" height="10%" />
	      </a>
	    </p>
        </ModalDialog>
    </ModalContainer>;
  }
}

class SecondModal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
  }
  render() {
    return <ModalContainer onClose={this.props.onClose}>
      <ModalDialog onClose={this.props.onClose} width={350} className="userHelpDialog">
        <h1>Second Dialog</h1>
        <p>When you hit esc, only this one will close</p>
      </ModalDialog>
    </ModalContainer>;
  }
}
