// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: AlertAllowPopupWindows.jsx
// Time-stamp: <2018-11-14 10:44:21 (zinn)>
// -------------------------------------------

import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

export default class AlertAllowPopupWindows extends React.Component {
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
        <AlertAllowPopupWindowsText onClose={this.closeModal}/>
      : null}
    </a>;
  }
}

class AlertAllowPopupWindowsText extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
  }
  render() {
    return <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} className="systemAlertDialog"  width={400}>
	    <h2>Unable to Open Tool in New Window</h2>
	    <p>
	  Please configure your browser to allow pop-up windows from this site. 
	    </p>
        </ModalDialog>
    </ModalContainer>;
  }
}

