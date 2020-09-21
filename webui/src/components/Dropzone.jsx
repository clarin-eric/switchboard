import React from 'react';
import PropTypes from 'prop-types';

export class Dropzone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hovering: 0,
        };
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    onDragEnter(e) {
        e.preventDefault();
        this.setState({hovering: this.state.hovering+1});
    }

    onDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        return false
    }

    onDragLeave(e) {
        e.preventDefault();
        this.setState({hovering: Math.max(this.state.hovering-1,0)});
    }

    onDrop(e) {
        e.preventDefault();
        this.setState({hovering: 0});
        const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        this.props.onFiles(files);
    }

    render() {
        const noshow = {width:0, height:0, margin:0, border:'none'};
        const input = <input ref={r=>this.fileinput=r} name="file" type="file" style={noshow} onChange={this.onDrop} tabIndex={-1}/>;
        return (
            <button className={'col-xs-12 btn-default dropzone' + (this.state.hovering ? ' active' : '')}
                    onClick={() => {if (this.fileinput) this.fileinput.click()}}
                    onDragEnter={this.onDragEnter} onDragOver={this.onDragOver} onDragLeave={this.onDragLeave} onDrop={this.onDrop}>
                <h4 style={{color:'gray', margin:'2em'}}>Drop files here, or click to select file</h4>
                {input}
            </button>
        );
    }
}

Dropzone.propTypes = {
    onFiles: PropTypes.func.isRequired,
};
