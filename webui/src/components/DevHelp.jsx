// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
//
// File: DevHelp.jsx
// Time-stamp: <2018-09-21 09:49:01 (zinn)>
// -------------------------------------------

import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import {emailContactCommand, image} from './../back-end/util';

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
      For Developers
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
  render() {
    return <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} className="devHelpDialog"  width={800} margin={50}>
            <h2>How to get your tool listed in the CLARIN LRS</h2>
          <p>For the time being, two pieces of information about a resource are used to identify whether there is any tool
            that can process the resource:</p>
          <ul>
            <li>mimetype: automatically detected once the resource has been dragged & dropped into the drop area.</li>
            <li>language: the language the resource is in. Apache Tika is used to identify the language of the resource.</li>
          </ul>
          <p>For each tool, the LRS switchboard requires a metadata description that gives the switchboard all relevant information for tool applicability and invocation. In particular, the metadata description has slots that describe all the mimetypes and all the languages that the tool can process. </p>
          <p>Example:</p>
          <img src={image("metadataListing1.png")} width="71%" height="71%" />
          <p>
            The metadata description specifies, among other things, that Weblicht can process
            German resources of type 'text/plain'.
          </p>
          <p>
            All applicable tools are identified once the user presses the 'Show Tools' button. Tools are aggregated under a task systematics. Selecting a tool opens the info pane about the tool. If the user clicks on 'Click to start tool' link, the respective tool is invoked by passing a number of parameters on, in particular:
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
          <img src={image("metadataListing2.png")} width="33%" height="33%" />
          <p>
            Here, the URL parameter <em>input</em> is replaced by the parameter <em>URL</em>,
            and <em>lang</em> is replaced by <em>language</em>
          </p>

          <p>
            For any questions, please contact the <a href={ emailContactCommand }>Switchboard Team</a>.
          </p>
        </ModalDialog>
</ModalContainer>;
  }
}


