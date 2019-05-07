// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: AlertURLUploadError.jsx
// Time-stamp: <2018-11-13 17:04:10 (zinn)>
// -------------------------------------------

import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

export default class AlertURLUploadError extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  }

  constructor(props) {
	super(props);
	this.propagateFun = this.props.onCloseProp;
  }
    
  state = {
    showModal: true
  }
  openModal = () => {
    this.setState({showModal: true});
  }
  closeModal = () => {
      this.setState({showModal: false});
      this.propagateFun();            
  }
  render() {
    return <a className={this.props.className} onClick={this.openModal}>
      {this.state.showModal ?
        <AlertURLUploadErrorText onClose={this.closeModal}/>
      : null}
    </a>;
  }
}

class AlertURLUploadErrorText extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
  }
  render() {
    return <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} className="systemAlertDialog"  width={400}>
	    <h2>Resource Upload Error</h2>
	    <p>
	  The switchboard was unable to upload your resource to a file storage location (so that the resource becomes accessible for the tools connected to the switchboard). Likely the resource is too large or its MIME type is not allowed. Please select a different resource with file size smaller than 5 MB. If failure persists, please contact "switchboard@clarin.eu". 
	    </p>
        </ModalDialog>
    </ModalContainer>;
  }
}

