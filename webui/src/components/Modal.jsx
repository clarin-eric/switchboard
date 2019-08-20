
import React from 'react';
import PropTypes from 'prop-types';
import * as ReactModal from 'react-modal';


// use as:
// <Modal linkText="About"> <AboutHelp contact={contactEmail}/> </Modal>

export default class Modal extends React.Component {
    constructor () {
        super();
        this.state = {
            showModal: false
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleOpenModal () {
        this.setState({ showModal: true });
    }

    handleCloseModal () {
        this.setState({ showModal: false });
    }

    render () {
        return (
            <div>
                <a onClick={this.handleOpenModal}>{this.props.linkText}</a>
                <ReactModal isOpen={this.state.showModal}
                            onRequestClose={this.handleCloseModal}
                            contentLabel={this.props.linkText}>
                    <button className="btn btn-danger" style={{float:'right'}}
                        onClick={this.handleCloseModal}>x</button>
                    <div style={{clear:'both'}}/>
                    {this.props.children}
                    <button className="btn btn-default" style={{float:'right'}}
                        onClick={this.handleCloseModal}>Close</button>
                    <div style={{clear:'both'}}/>
                </ReactModal>
            </div>
        );
    }
}
