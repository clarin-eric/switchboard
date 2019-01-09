// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: AlertNoTools.jsx
// Time-stamp: <2018-11-29 23:06:31 (zinn)>
// -------------------------------------------

import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

export default class AlertNoTools extends React.Component {
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
        <AlertNoToolsText onClose={this.closeModal}/>
      : null}
    </a>;
  }
}

class AlertNoToolsText extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
  }
  render() {
    return <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} className="systemAlertDialog"  width={400}>
	    <h2>No Applicable Tools</h2>
	  <p>
	  The Switchboard has currently no applicable tool than can process the given resource (given its mediatype and language). Please try again with another resource.
	    </p>
        </ModalDialog>
    </ModalContainer>;
  }
}

