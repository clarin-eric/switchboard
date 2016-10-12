import React, {PropTypes} from 'react';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

export default class AboutHelp extends React.Component {
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
      About
      {this.state.showModal ?
        <AboutHelpText onClose={this.closeModal}/>
      : null}
    </a>;
  }
}

class AboutHelpText extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
  }
  render() {
    return <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} className="devHelpDialog"  width={800}>
	  <h2>The CLARIN Language Resource Switchboard (LRS)</h2>
	  <p><center><small><b><em>Leave Help with ESC</em></b></small></center></p>

	  <p>
	  The CLARIN LRS is a service provided by <a href="https://www.clarin.eu" target="_blank" >CLARIN</a> and is
	  being developed in the European CLARIN-PLUS project (Project Number: 676529) to further
	  strengthen the CLARIN Infrastructure.
	  </p>
	  <p>
	  The LRS is currently accessible from the <a href="https://vlo.clarin.eu" target="_blank">CLARIN Virtual
	  Language Observatory</a>, but can also been used in a standalone fashion.  
	  </p>
	  <p>
	    We value your feedback! For any questions or suggestions, please contact: <a href="mailto:claus.zinn@uni-tuebingen.de?subject=CLARIN-PLUS LRS">Claus Zinn</a>. But please consult the user and developer help beforehand (see top navigation bar).
	  </p>
        </ModalDialog>
</ModalContainer>;
  }
}
