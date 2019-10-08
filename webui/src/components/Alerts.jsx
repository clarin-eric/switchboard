import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import {clientPath} from '../constants';
import {isUrl} from '../actions/utils';

export class Alerts extends React.Component {
    constructor(props) {
        super(props);
        this.renderAlert = this.renderAlert.bind(this);
    }

    renderManualDownload(url) {
        if (!url) return false;
        return (
            <React.Fragment>
                <p>{ isUrl(url) ? <a href={url}>{url}</a> : <span style={{color:'#000'}}>{url}</span> } </p>
                <p>Please try downloading the resource manually and then uploading it into the Switchboard.</p>
            </React.Fragment>
        );
    }

    renderAlert(alert, idx) {
        if (!alert) return false;
        return (
            <div key={idx} className="alert alert-danger">
                <p>{alert.message}</p>
                {this.renderManualDownload(alert.url)}
            </div>
        );
    }

    render() {
        if (!this.props.alerts.length) {
            return false;
        }
        const styles = {
            content: {
                top        : '50%',
                left       : '50%',
                right      : 'auto',
                bottom     : 'auto',
                marginRight: '-50%',
                transform  : 'translate(-50%, -50%)',
                border: 'none',
            }
        };
        return (
            <Modal isOpen={!!this.props.alerts.length} onRequestClose={this.props.clearAlerts} style={styles} contentLabel="Example Modal">
                <div className="alert alert-danger" style={{marginBottom:0, textAlign:'center'}}>
                    <h3 className="alert-danger" style={{marginTop:0}}>Error</h3>
                    {this.props.alerts.map(this.renderAlert)}
                    <div style={{textAlign: 'center', marginTop:'1em'}}>
                        <button className="btn btn-block" onClick={this.props.clearAlerts}>Close</button>
                    </div>
                </div>
            </Modal>
        );
    }
}
