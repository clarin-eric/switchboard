import React from 'react';
import PropTypes from 'prop-types';
import { HashLink as Link } from 'react-router-hash-link';
import {Dropzone} from './Dropzone';
import {clientPath} from '../constants';

export class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            link: "",
        };
        this.handleFiles = this.handleFiles.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleTextSubmit = this.handleTextSubmit.bind(this);
        this.handleLinkChange = this.handleLinkChange.bind(this);
        this.handleLinkSubmit = this.handleLinkSubmit.bind(this);
    }

    handleFiles(files) {
        if (!files.length) {
            alert('No file selected');
            return;
        }

        this.props.onFile(files[0]);
        this.props.history.push(clientPath.root);
    }

    handleLinkChange(e) {
        this.setState({link: event.target.value});
    }

    handleLinkSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        this.props.onLink(this.state.link);
        this.props.history.push(clientPath.root);
    }

    handleTextChange(e) {
        this.setState({text: event.target.value});
    }

    handleTextSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        var blob = new Blob([this.state.text], {type: "text/plain"});
        blob.name = "submitted_text.txt";
        this.props.onFile(blob);
        this.props.history.push(clientPath.root);
    }

    render() {
        return (
            <div className="input">
                <h3>Add your data</h3>

                <Dropzone onFiles={this.handleFiles}/>

                <form className="input-group linkinput" onSubmit={this.handleLinkSubmit}>
                    <textarea className="form-control inputzone"
                        style={{resize: 'vertical'}}
                        onChange={this.handleLinkChange}
                        rows="2"
                        placeholder="Or enter an URL or DOI or handle here."
                        value={this.state.link} />
                    <span className="input-group-addon">
                        <button type="submit" className="btn btn-primary" disabled={!this.state.link.trim()}>
                        Send link
                        </button>
                    </span>
                </form>

                <form className="input-group textinput" onSubmit={this.handleTextSubmit}>
                    <textarea className="form-control inputzone"
                        style={{resize: 'vertical'}}
                        onChange={this.handleTextChange}
                        rows="5"
                        placeholder="Or enter text here."
                        value={this.state.text} />
                    <span className="input-group-addon">
                        <button type="submit" className="btn btn-primary" disabled={!this.state.text.trim()}>
                        Submit text
                        </button>
                    </span>
                </form>

                <p style={{marginTop:20}}>
                    Please be advised that the data will be shared with the tools via public links.
                    For more details, see the <Link to={clientPath.faq}>FAQ</Link>.
                </p>
            </div>
        );
    }
}

Input.propTypes = {
    onFile: PropTypes.func.isRequired,
};

