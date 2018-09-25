// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: AlertShibboleth.jsx
// Time-stamp: <2018-07-04 09:52:07 (zinn)>
// -------------------------------------------

import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

export default class AlertShibboleth extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  }
  state = {
    showModal: true
  }
  openModal = () => {
    this.setState({showModal: true});
  }
  closeModal = () => {
    this.setState({showModal: false});
  }
  render() {
    return <a className={this.props.className} onClick={this.openModal}>
      {this.state.showModal ?
        <AlertShibbolethText onClose={this.closeModal}/>
      : null}
    </a>;
  }
}

class AlertShibbolethText extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
  }
  render() {
    return <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} className="systemAlertDialog"  width={400}>
	    <h2>Resource Retrieval Error</h2>
	    <p>
	    The resource seems to be behind a Shibboleth authentication wall. Please fetch the resource with your authentication credentials by clicking on "Link to Resource". Then use the standalone version of the LRS to upload the resource.
	    </p>
	    
        </ModalDialog>
    </ModalContainer>;
  }
}

