// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: AlertURLIncorrectError.jsx
// Time-stamp: <2018-11-13 17:01:58 (zinn)>
// -------------------------------------------

import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

export default class AlertURLIncorrectError extends React.Component {
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
        <AlertURLIncorrectErrorText onClose={this.closeModal}/>
      : null}
    </a>;
  }
}

class AlertURLIncorrectErrorText extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
  }
  render() {
    return <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} className="systemAlertDialog"  width={400}>
	    <h2>Incorrect URL</h2>
	    <p>
	      It seems that you have entered an incorrect or partial URL. Please correct the URL and then try again.
	    </p>
        </ModalDialog>
    </ModalContainer>;
  }
}

