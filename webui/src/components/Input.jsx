import React from 'react';
import PropTypes from 'prop-types';
import { HashLink as Link } from 'react-router-hash-link';
import {Dropzone} from './Dropzone';
import {Dropdown} from './Dropdown';
import {clientPath} from '../constants';
import {isUrl} from '../actions/utils';

export class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            type: 'text',
        };
        this.handleFiles = this.handleFiles.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    static propTypes = {
        onFile: PropTypes.func.isRequired,
        onLink: PropTypes.func.isRequired,
    };


    handleFiles(files) {
        if (!files.length) {
            alert('No file selected');
            return;
        }

        this.props.onFile(files[0]);
        this.props.history.push(clientPath.root);
    }

    handleChange(e) {
        const text = event.target.value;
        const type = isUrl(text) ? "url" : "text";
        this.setState({text, type});
    }

    handleSubmit(e, option) {
        e.preventDefault();
        e.stopPropagation();

        if (option.value === 'text') {
            var blob = new Blob([this.state.text], {type: "text/plain"});
            blob.name = "submitted_text.txt";
            this.props.onFile(blob);
        } else {
            this.props.onLink(this.state.text);
        }

        this.props.history.push(clientPath.root);
    }

    render() {
        let options = [
            {value: "text", label: "Submit Text", style: {}},
            {value: "url", label: "Submit URL", style: {backgroundColor:'#eef'}},
        ];
        const current = options.find(x => x.value === this.state.type);
        options = options.filter(x => x.value !== this.state.type);
        options.unshift(current);

        // todo: reorder options based on current type

        return (
            <div className="input">
                <h3>Add your data</h3>

                <Dropzone onFiles={this.handleFiles}/>

                <form className="input-group textinput" onSubmit={this.handleSubmit}>
                    <textarea className="form-control inputzone"
                        style={{resize: 'vertical'}}
                        onChange={this.handleChange}
                        rows="5"
                        placeholder="Or enter an URL/DOI/handle or text here."
                        value={this.state.text} />
                    <div className="input-group-addon" style={current.style}>
                    <Dropdown type="submit" className="btn-primary"
                        disabled={!this.state.text.trim()}
                        onClick={this.handleSubmit}
                        options={options}/>
                    </div>
                </form>

                <p style={{marginTop:20}}>
                    Please be advised that the data will be shared with the tools via public links.
                    For more details, see the <Link to={clientPath.faq}>FAQ</Link>.
                </p>
            </div>
        );
    }
}