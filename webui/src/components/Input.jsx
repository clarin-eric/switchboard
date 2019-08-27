import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Dropzone} from './Dropzone';
import {clientPath} from '../constants';

export class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
        };
        this.handleFiles = this.handleFiles.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleTextSubmit = this.handleTextSubmit.bind(this);
    }

    handleFiles(files) {
        if (!files.length) {
            alert('No file selected');
            return;
        }

        this.props.onFile(files[0]);

        this.props.history.push(clientPath.root);
    }

    handleTextSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        var blob = new Blob([this.state.text], {type: "text/plain"});
        blob.name = "submitted_text.txt";
        this.props.onFile(blob);

        this.props.history.push(clientPath.root);
    }

    handleTextChange(e) {
        this.setState({text: event.target.value});
    }

    render() {
        return (
            <div className="input">
                <h3>Add your data</h3>

                <Dropzone onFiles={this.handleFiles}/>

                <form className="input-group" onSubmit={this.handleTextSubmit}>
                    <textarea className="form-control inputzone"
                        style={{resize: 'vertical'}}
                        onChange={this.handleTextChange}
                        rows="5"
                        placeholder="Or enter text or a web link here."
                        value={this.state.value} />
                    <span className="input-group-addon">
                        <button type="submit" className="btn">Submit</button>
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

