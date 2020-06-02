import React from 'react';
import Select from 'react-select';
import { processMediatype, humanSize } from '../actions/utils';

const SelectLanguage = (props) => {
    const value = props.languages.find(x => x.value == props.res.profile.language);
    return <Select
        value={value}
        options={props.languages.asMutable()}
        onChange={props.onLanguage}
        placeholder="Select the language of the resource"
    />;
}

const SelectMediatype = (props) => {
    const options = props.mediatypes.asMutable();
    let value = props.mediatypes.find(x => x.value == props.res.profile.mediaType);
    if (props.res.profile.mediaType && !value) {
        value = processMediatype(props.res.profile.mediaType);
        value.label = value.label + " [unsupported]";
        if (value) {
            options.unshift(value);
        }
    }

    return <Select value={value} options={options} onChange={props.onMediatype}
            placeholder="Select the mediatype of the resource"/>;
}

export class Resource extends React.Component {
    constructor(props) {
        super(props);
    }

    onChange(type, sel) {
        const newresource = this.props.resource.setIn(['profile', type], sel.value);
        this.props.updateResource(newresource);
    }

    render() {
        const res = this.props.resource;
        console.log({res});
        return <React.Fragment>
            <div className="resource">
                <div className="row hidden-xs">
                    <div className="col-md-12">
                        <h2>Resource</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="value namesize">
                            <a href={res.originalLink || res.localLink}> {res.filename}</a>
                            <span>{humanSize(res.fileLength)}</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="row">
                            <div className="col-xs-4 col-md-12 resource-header">Mediatype</div>
                            <div className="col-xs-8 col-md-12 value">
                                <SelectMediatype res={res} mediatypes={this.props.mediatypes}
                                    onMediatype={v => this.onChange('mediaType', v)}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="row">
                            <div className="col-xs-4 col-md-12 resource-header">Language</div>
                            <div className="col-xs-8 col-md-12 value">
                                <SelectLanguage res={res} languages={this.props.languages}
                                    onLanguage={v => this.onChange('language', v)}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>;
    }
}
