import React, {PropTypes} from 'react';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

export default class DevHelp extends React.Component {
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
      Developer
      {this.state.showModal ?
        <DevHelpText onClose={this.closeModal}/>
      : null}
    </a>;
  }
}

class DevHelpText extends React.Component {
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
        <ModalDialog onClose={this.props.onClose} className="devHelpDialog"  width={800}>
          {this.state.showSecondModal ?
            <SecondModal onClose={this.closeModal}/>
          : null}
	    
	    <h2>How to get your tool listed in the CLARIN LRS</h2>
	    <p><center><small><b><em>Leave Help with ESC</em></b></small></center></p>	    
	  <p>For the time being, two pieces of information about a resource are used to identify whether there is any tool
	    that can process the resource:</p>
	  <ul>
	    <li>mimetype: automatically detected once the resource has been dragged & dropped into the drop area.</li>
	    <li>language: the language the resource is in. Apache Tika is used to identify the resource' language.</li>		
	  </ul>
	  <p>For each tool, the LRS switchboard requires a metadata description that gives the switchboard all relevant information for tool applicability. In particular, the metadata description has, you guessed it, slots that describe all the mimetypes and all the languages that the tool can process. </p>
	  <p>Example:</p>
	  <img className="alignCenter" src="metadataListing1.png" width="71%" height="71%" />	  
	  <p>
	    The metadata description specifies, among other things, that Weblicht can process
	    German resources of type 'text/plain'.
	  </p>
	  <p>
	    All applicable tools are identified once the user presses the 'Show Tools' button. Tools are aggregated under a task systematics (preliminary). Selecting a tool opens the info pane about the tool. If the user clicks on 'Click to start tool' link, the respective tool is invoked by passing a number of parameters on, in particular:
	  </p>
	  <ul>
	    <li>a pointer to the URL where the resource in question can be downloaded from</li>
	    <li>the language of the resource</li>
	    <li>the task requested</li>
	    <li><em>potentially other information can be passed, of course, for instance, the mimetype of the resource.</em></li>
	  </ul>
	  <p>For Weblicht, a typical call looks like:</p>
	  <listing>
	      http://tuebingen.weblicht.sfs.uni-tuebingen.de:8888/weblicht/?input=http://ws1-clarind.esc.rzg.mpg.de/drop-off/storage/webRot.txt&lang=de&analysis=dep-parsing&
	  </listing>
	  <p>
	    Note that the name of the parameters (input, lang, analysis) are specific for Weblicht -- and also recorded in the metadata description of Weblicht. If your tool has a different parameter set, you do not need to change them. Just record them in the metadata, make use of the slot <em>mapping</em>, e.g.,
	  </p>
	  <img className="alignCenter" src="metadataListing2.png" width="33%" height="33%" />
	  <p>
	    Here, the URL parameter <em>input</em> is replaced by the parameter <em>URL</em>,
	    and <em>lang</em> is replaced by <em>language</em>
	  </p>
	  
	  <p>
	    For any questions, please contact: <a href="mailto:claus.zinn@uni-tuebingen.de?subject=CLARIN-PLUS LRS">Claus Zinn</a>.
	  </p>
          <p>You can open up a <a onClick={this.openModal}>second modal</a> within this!</p>
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
      <ModalDialog onClose={this.props.onClose} width={350} className="devHelpDialog">
        <h1>Second Dialog</h1>
        <p>When you hit esc, only this one will close</p>
      </ModalDialog>
    </ModalContainer>;
  }
}
