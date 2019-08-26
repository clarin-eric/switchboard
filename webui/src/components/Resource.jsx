import React from 'react';
import {Dropzone} from './Dropzone';
import {Link} from 'react-router-dom';

export class Resource extends React.Component {
    constructor(props) {
        super(props);
    }

    // "border-width: 2px; border-color: black; border-style: solid; border-radius: 4px; margin: 10px 10px 10px 20px; padding: 10px; width: 785px; height: 160px; resize: none; transition: all 0.5s ease 0s; display: inline-block;"
    render() {
        const res = this.props.resource;
        const gridStyle = {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            justifyContent: 'center',
            padding: 10,
            border: '1px solid #ddd',
            borderRadius: 8,
        };
        return <React.Fragment>
            <div className="resource" style={gridStyle}>
                <div>Resource</div>
                <div>Mediatype</div>
                <div>Language</div>
                <div>
                    <a href={res.originalLink || res.localLink}> {res.filename} </a>
                </div>
                <div>
                    <span>{res.mediatype}</span>
                </div>
                <div>
                    <span>{res.language && res.language.language}</span>
                </div>
            </div>
        </React.Fragment>;
    }
}
