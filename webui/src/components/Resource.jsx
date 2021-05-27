import React from 'react';
import Select from 'react-select';
import { processMediatype, humanSize, isViewableProfile, isTextProfile, isContainerProfile } from '../actions/utils';
import { InputContainer } from '../containers/InputContainer';

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

class BlurableTextInput extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }

    render() {
        return <input type="text" ref={this.inputRef} value={this.props.value}
            onChange={e=>this.props.onChange(e.target.value)}
            onKeyDown={e => {if (e.keyCode == 13) this.inputRef.current.blur() }}/>;
    }
}


class NormalResource extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showContent: false,
        }
    }

    render() {
        const res = this.props.res;
        const showContent = this.state.showContent && isViewableProfile(res.profile.mediaType);
        const toggleContentButton = res.content && isViewableProfile(res.profile.mediaType) || res.outline ?
            <a  style={{fontSize:'70%', marginLeft:10}}
                onClick={e => this.setState({showContent:!this.state.showContent})} >
                { showContent ?
                    <span className="glyphicon glyphicon-eye-close" aria-hidden="true"/> :
                    <span className="glyphicon glyphicon-eye-open" aria-hidden="true"/>
                }
            </a> : false;
        const removeButton = (this.props.enableMultipleResources || res.sourceID) ?
            <a onClick={e => this.props.removeResource(res)}>
                <span className={"glyphicon glyphicon-trash"}
                    style={{fontSize:'80%', marginLeft: 10}} aria-hidden="true"/>
            </a> : false;
        const contentDiv = showContent ?
            <div className="content">
                {res.content && isTextProfile(res.profile.mediaType) ?
                    <pre style={{maxHeight: 200}}> {res.content} </pre> :
                    false
                }
                {res.outline ?
                    <div style={{maxHeight: 200, margin:10, overflow: 'auto'}}>
                        {res.outline.map(entry =>
                            <div className="row" style={{margin:4, padding:0}} key={entry.name}>
                                <div className="col-sm-8" style={{padding:0}}>
                                    <label style={{fontWeight:'normal', marginBottom:0}}>
                                        {res.sourceID ? false : // don't show selector in nested zips
                                            <input type={this.props.enableMultipleResources ? "checkbox" : "radio"}
                                                name={entry.name}
                                                onChange={() => this.props.toggleZipEntryToInputs(res, entry)}
                                                checked={entry.checked || false} />
                                        }
                                        {" "}
                                        <span className={"glyphicon glyphicon-file"} aria-hidden="true"/>
                                        {" "}
                                        {entry.name}
                                    </label>
                                </div>
                                <div className="col-sm-2">{(entry.profile||{}).mediaType || ""}</div>
                                <div className="col-sm-2">{humanSize(entry.size)}</div>
                            </div>
                        ) }
                    </div> : false
                }
            </div> : false;
        return <div className={"row" + (res.isContainer ? " disabled":"") + (res.sourceID ? " dependent" : "")}>
                <div className={res.isContainer ? "col-md-12" : "col-md-5"}>
                    <div className="value namesize">
                        <a href={res.originalLink || res.localLink} style={{marginRight:10}}> {res.filename}</a>
                        <span style={{fontSize:'66%'}} style={{marginRight:10}}>{humanSize(res.fileLength)}</span>
                        {removeButton}
                        {toggleContentButton}
                    </div>
                </div>
                { showContent ?
                    <div className="col-md-12 visible-xs visible-sm">
                        {contentDiv}
                    </div> : false
                }
                { res.isContainer ? false :
                    <React.Fragment>
                    <div className="col-md-4">
                        <div className="row">
                            <div className="col-xs-4 col-md-12 resource-header">Mediatype</div>
                            <div className="col-xs-8 col-md-12 value">
                                <SelectMediatype res={res} mediatypes={this.props.mediatypes}
                                    onMediatype={v => this.props.setResourceProfile(res.id, 'mediaType', v.value)}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="row">
                            <div className="col-xs-4 col-md-12 resource-header">Language</div>
                            <div className="col-xs-8 col-md-12 value">
                                <SelectLanguage res={res} languages={this.props.languages}
                                    onLanguage={v => this.props.setResourceProfile(res.id, 'language', v.value)}/>
                            </div>
                        </div>
                    </div>
                    </React.Fragment>
                }
                { showContent ?
                    <div className="col-md-12 hidden-xs hidden-sm">
                        {contentDiv}
                    </div> : false
                }
            </div>
    }
}

class SelectionResource extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const res = this.props.res;
        return (
            <div key={res.id} className="row">
                <div className="col-md-8">
                    <div className="row">
                        <div className="col-xs-12 namesize content">
                            <BlurableTextInput value={res.content}
                                onChange={text => this.props.setResourceContent(res.id, text)}/>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="row">
                        <div className="col-xs-4 col-md-12 resource-header">Language</div>
                        <div className="col-xs-8 col-md-12 value">
                            <SelectLanguage res={res} languages={this.props.languages}
                                onLanguage={v => this.props.setResourceProfile(res.id, 'language', v.value)}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export class ResourceList extends React.Component {
    constructor(props) {
        super(props);
        this.renderResource = this.renderResource.bind(this);
        this.state = {
            showAddMoreDataPane: false,
            // showContent: {},
        }
    }

    renderResource(res) {
        if (res.isDictionaryResource) {
            return <SelectionResource
                        languages={this.props.languages}
                        setResourceProfile={this.props.setResourceProfile}
                        setResourceContent={this.props.setResourceContent}
                        res={res} />;
        }
        if (res.profile) {
            return <NormalResource
                        mediatypes={this.props.mediatypes}
                        languages={this.props.languages}
                        setResourceProfile={this.props.setResourceProfile}
                        removeResource={this.props.removeResource}
                        toggleZipEntryToInputs={this.props.toggleZipEntryToInputs}
                        enableMultipleResources={this.props.enableMultipleResources}
                        res={res} />;
        }
        return (
            <div className={"row" + (res.sourceID ? " dependent" : "")}>
                <div className="col-md-4">
                    <div className="value namesize">
                        <p>Uploading...</p>
                    </div>
                </div>
            </div>
        );
    }

    renderAddMoreDataPane() {
        return (
            <div className="more-data-pane">
                <InputContainer title="Add another resource" onSubmit={() => this.setState({showAddMoreDataPane:false})}/>
                <a onClick={e => this.setState({showAddMoreDataPane:false})} className="btn btn-default" style={{float:'right'}}>
                    <span className={"glyphicon glyphicon-remove"} aria-hidden="true"/>
                    {" "}Dismiss
                </a>
                <div style={{clear:'both'}}/>
           </div>
        );
    }

    renderAddResourceButton() {
        return (
            <div className="more-data-button">
                <a onClick={e => this.setState({showAddMoreDataPane:true})} style={{float:'right'}}>
                    <span className={"glyphicon glyphicon-plus"} aria-hidden="true"/>
                    {" "}Add another resource
                </a>
            </div>
        );
    }

    render() {
        const isDict = this.props.resourceList.every(res => res.isDictionaryResource);
        return (
            <React.Fragment>
                <div className="resource">
                    <div className="row hidden-xs">
                        <div className="col-md-12">
                            <h2>Resources</h2>
                        </div>
                    </div>
                    {this.props.resourceList.map(r =>
                        <React.Fragment key={r.id}>{this.renderResource(r)}</React.Fragment>
                     )}
                </div>
                { this.state.showAddMoreDataPane ?
                    this.renderAddMoreDataPane() :
                    (this.props.enableMultipleResources && !isDict ?
                        this.renderAddResourceButton() :
                        false)
                }
                <div style={{clear:'both'}}/>
            </React.Fragment>
        );
    }
}
