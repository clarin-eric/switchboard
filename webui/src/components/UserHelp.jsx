// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
//
// File: UserHelp.jsx
// Time-stamp: <2019-01-14 10:33:45 (zinn)>
// -------------------------------------------

import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import {image} from './util';

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
        <UserHelpText onClose={this.closeModal} contact={this.props.contact}/>
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
          <p>The switchboard helps you to find and start tools that can process your research data.
            You have three options to enter your resource:
            <center>
              <img
                style={{
                   width: '75%',
                   height: '75%'
                }}
                src={image("dropResources.png")}
                 />
            </center>
            <ul>
              <li>Drag your data from your file manager to the left-most area. Alternatively, click
                on the area to select a file to be uploaded. </li>
              <li>Paste any URL that refers to your resource into the middle box, say, a shared link from
                your B2DROP account. </li>
              <li>Type any (plain) text into the right-most dotted area. For longer texts, please save it
                to the file, and use the first upload method.</li>
            </ul>

            Note. When the switchboard is invoked via the Virtual Language Observatory, or via
            B2DROP, or (in the future) via the Virtual Collection Registry, the "file drop" happens during the
            transferal.
          </p>

          <p>
            Once your research data has been uploaded, ...
            <ol>
              <li>an information pane appears with basic information about the file. Please verify
                the mediatype and language, and correct it when necessary.  Then, click on <b>Show Tools</b>.
              </li>
              <li>In the Tools View, click on a tool of interest to get additional information
              about the selected tool. Then use <b>Click to start tool</b> to open the selected
              tool in a new browser tab.
              </li>
            </ol>
          </p>

          <h3>For transferals from the Virtual Language Observatory</h3>
            <p>
              When the LRS is called from the VLO, please beware. The resource of interest may not be
              accessible to the switchboard because:
              <ul>
                <li>it is behind an authentication wall, or</li>
                <li>the resource link points to a viewer application that shows the resource, not to
                  the resource itself.</li>
              </ul>
              In these cases, try downloading the resource from the resource provider, then use the
              file drop mechanism at <a href="https://switchboard.clarin.eu"> https://switchboard.clarin.eu</a>.
            </p>
            <hr />
            <p>
              Questions? Please contact the <a href={ this.props.contact }>Switchboard Team</a>.
            </p>
        </ModalDialog>
    </ModalContainer>;
  }
}

