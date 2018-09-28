// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: AlertMissingInfo.jsx
// Time-stamp: <2018-09-28 12:51:55 (zinn)>
// -------------------------------------------

import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

export default class AlertMissingInfo extends React.Component {
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
        <AlertMissingInfoText onClose={this.closeModal}/>
      : null}
    </a>;
  }
}

class AlertMissingInfoText extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
  }
  render() {
    return <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} className="systemAlertDialog"  width={400}>
	    <h2>Missing Information</h2>
	    <p>
	  Please specify the language AND mimetype of the given resource, then try again.
	    </p>
        </ModalDialog>
    </ModalContainer>;
  }
}

