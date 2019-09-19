import React from 'react';
import Select from 'react-select';

const SelectLanguage = (props) => {
    const value = props.languages.find(x => x.value == props.res.language);
    return <Select
        value={value}
        options={props.languages.asMutable()}
        onChange={props.onLanguage}
        placeholder="Select the language of the resource"
    />;
}

const SelectMediatype = (props) => {
    const value = props.mediatypes.find(x => x.value == props.res.mediatype);
    return <Select
        value={value}
        options={props.mediatypes.asMutable()}
        onChange={props.onMediatype}
        placeholder="Select the mediatype of the resource"
    />;
}

export class Resource extends React.Component {
    constructor(props) {
        super(props);
    }

    onChange(type, sel) {
        const res = this.props.resource;
        const newres = res.set(type, sel.value);
        this.props.updateResource(newres);
    }

    render() {
        const res = this.props.resource;
        return <React.Fragment>
            <div className="resource">
                <div className="row">
                    <div className="col-md-4">
                        <div className="resource-header">Resource</div>
                        <div>
                            <a href={res.originalLink || res.localLink}> {res.filename} </a>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="resource-header">Mediatype</div>
                        <div>
                            <SelectMediatype res={res} mediatypes={this.props.mediatypes}
                                onMediatype={v => this.onChange('mediatype', v)}/>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="resource-header">Language</div>
                        <div>
                            <SelectLanguage res={res} languages={this.props.languages}
                                onLanguage={v => this.onChange('language', v)}/>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>;
    }
}
