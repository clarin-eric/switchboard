import React from 'react';
import Select from 'react-select';
import { processMediatype, humanSize, isCompressedProfile, isTextProfile, isArchiveProfile } from '../actions/utils';
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

class ContentOrOutline extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const res = this.props.res;
        const showContent = res.content && isTextProfile(res.profile.mediaType);
        const headerText = this.props.enableMultipleResources ?
            "Select files for further processing":
            "Select a file for further processing";
        return (
           <div className="content">
                { showContent ? <pre> {res.content} </pre> : false }
                { res.outline && !showContent ?
                    <div className="outline">
                        <span className="outlineHeader">{headerText}</span>
                        {res.outline.map(entry =>
                            <div className="row" key={entry.name}>
                                <div className="col-sm-8" style={{padding:0}}>
                                    <label style={{fontWeight:'normal', marginBottom:0}}>
                                        {res.sourceID ? false : // don't show selector in nested archives
                                            <input type={this.props.enableMultipleResources ? "checkbox" : "radio"}
                                                name={entry.name}
                                                onChange={() => this.props.toggleArchiveEntryToInputs(res, entry)}
                                                checked={entry.checked || false} />
                                        }
                                        {" "}
                                        <span className={"glyphicon glyphicon-file"} aria-hidden="true"/>
                                        {" "}
                                        {entry.name}
                                    </label>
                                </div>
                                <div className="col-sm-2">{(entry.profile||{}).mediaType || ""}</div>
                                <div className="col-sm-2">{entry.size > 0 ? humanSize(entry.size) : ""}</div>
                            </div>
                        )}
                    </div> : false
                }
            </div>
        );
    }
}


class NormalResource extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showContentOrOutline: false,
        }
    }

    render() {
        const res = this.props.res;

        const showContentOrOutline = this.state.showContentOrOutline &&
                (isTextProfile(res.profile.mediaType) || isArchiveProfile(res.profile.mediaType));

        const toggleContentButton = (res.content && isTextProfile(res.profile.mediaType) || res.outline) ?
            <a className="btn btn-xs btn-default" style={{fontSize:'70%', verticalAlign: "text-bottom"}}
                onClick={e => this.setState({showContentOrOutline:!this.state.showContentOrOutline})} >
                { showContentOrOutline ? "Hide content" : "Show content" }
            </a> : false;

        const toggleCompressButton = isCompressedProfile(res.profile.mediaType) ?
            <a className="btn btn-xs btn-default" style={{fontSize:'70%', verticalAlign: "text-bottom"}}
                onClick={e => this.props.toggleCompressedResource(res)} >
                Uncompress
            </a> : false;

        const removeButton = (this.props.enableMultipleResources || res.sourceID) ?
            <a onClick={e => this.props.removeResource(res)}>
                <span className={"glyphicon glyphicon-trash"}
                    style={{fontSize:'80%', marginLeft: 10}} aria-hidden="true"/>
            </a> : false;

        return <div className={"row" + (res.isArchive ? " disabled":"") + (res.sourceID ? " dependent" : "")}>
                <div className={res.isArchive ? "col-md-12" : "col-md-5"}>
                    <div className="value namesize">
                        <a href={res.originalLink || res.localLink} style={{marginRight:10}}> {res.filename}</a>
                        <span style={{fontSize:'66%'}} style={{marginRight:10}}>{humanSize(res.fileLength)}</span>
                        {toggleContentButton}
                        {toggleCompressButton}
                        {removeButton}
                    </div>
                </div>
                { showContentOrOutline ?
                    <div className="col-md-12 visible-xs visible-sm">
                        <ContentOrOutline res={res}
                            enableMultipleResources={this.props.enableMultipleResources}
                            toggleArchiveEntryToInputs={this.props.toggleArchiveEntryToInputs} />
                    </div> : false
                }
                { res.isArchive ? false :
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
                { showContentOrOutline ?
                    <div className="col-md-12 hidden-xs hidden-sm">
                        <ContentOrOutline res={res}
                            enableMultipleResources={this.props.enableMultipleResources}
                            toggleArchiveEntryToInputs={this.props.toggleArchiveEntryToInputs} />
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
                        toggleArchiveEntryToInputs={this.props.toggleArchiveEntryToInputs}
                        toggleCompressedResource={this.props.toggleCompressedResource}
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
