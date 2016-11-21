import React, {PropTypes} from 'react';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

export default class UserHelp extends React.Component {
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
        <AlertURLFetchError onClose={this.closeModal}/>
      : null}
    </a>;
  }
}

class AlertURLFetchError extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
  }
  render() {
    return <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} className="systemAlertDialog"  width={400}>
	    <h2>Resource Retrieval Error</h2>
	    <p>
	  The switchboard was unable to fetch the URL (404 or similar). Please attempt to fetch the resource yourself by clicking on "Link to Resource". If successful, then please use the standalone version of the LRS with the resource in question.
	    </p>
        </ModalDialog>
    </ModalContainer>;
  }
}

