// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: AlertURLFetchError.jsx
// Time-stamp: <2018-07-04 09:52:35 (zinn)>
// -------------------------------------------

import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

export default class AlertURLFetchError extends React.Component {
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
        <AlertURLFetchErrorText onClose={this.closeModal}/>
      : null}
    </a>;
  }
}

class AlertURLFetchErrorText extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
  }
  render() {
    return <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} className="systemAlertDialog"  width={400}>
	    <h2>Resource Retrieval Error</h2>
	    <p>
	  The switchboard was unable to fetch the URL (404 or similar). Please attempt to fetch the resource yourself by pasting its link into a new browser tab. If successul, save the file to your computer, and then upload the resource via drag & drop into the switchboard's left-most drop area.
	    </p>
        </ModalDialog>
    </ModalContainer>;
  }
}

