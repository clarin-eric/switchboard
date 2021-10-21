import SI from 'seamless-immutable';
import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { processMediatype, humanSize, isCompressedProfile, hasExtractableTextProfile, isTextProfile, isArchiveProfile } from '../actions/utils';
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

    static propTypes = {
        value: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    render() {
        return <input type="text" ref={this.inputRef} value={this.props.value}
            onChange={e=>this.props.onChange(e.target.value)}
            onKeyDown={e => {if (e.keyCode == 13) this.inputRef.current.blur() }}/>;
    }
}

const ArchiveEntry = ({res, entry, enableMultipleResources, toggleArchiveEntryToInputs}) => {
    return (
        <div className="row" key={entry.name}>
            <div className="col-sm-8" style={{padding:0}}>
                <label style={{fontWeight:'normal', marginBottom:0}}>
                    {res.sourceID ? false : // don't show selector in nested archives
                        <input type={enableMultipleResources ? "checkbox" : "radio"}
                            name={entry.name}
                            onChange={() => toggleArchiveEntryToInputs(res, entry)}
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
    )
}


class ContentOrOutline extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        res: PropTypes.object.isRequired,
        enableMultipleResources: PropTypes.bool.isRequired,
        actions: PropTypes.object.isRequired,
    };

    render() {
        const res = this.props.res;
        const actions = this.props.actions;
        const hasContent = res.content && isTextProfile(res.profile.mediaType);
        if (!hasContent && !res.outline) {
            return false;
        }

        const headerText = actions.enableMultipleResources ?
            "Select files for further processing":
            "Select a file for further processing";
        return (
           <div className="content">
                { hasContent ?
                    <pre>
                        {res.content}
                        { res.content.length < res.fileLength ?
                            <button className="btn btn-info btn-xs" onClick={e=>actions.moreContent(res)}>
                                Show more content
                            </button> : false
                        }
                    </pre> : false
                }
                { res.outline && !hasContent ?
                    <div className="outline">
                        {res.sourceID ? false : <span className="outlineHeader">{headerText}</span>}
                        {res.outline.map(entry =>
                            <ArchiveEntry
                                key={res.id+entry.name}
                                res={res}
                                entry={entry}
                                enableMultipleResources={this.props.enableMultipleResources}
                                toggleArchiveEntryToInputs={actions.toggleArchiveEntryToInputs} />
                        )}
                        {res.outlineIsIncomplete ? <span>...</span> : false}
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

    static propTypes = {
        mediatypes: PropTypes.array.isRequired,
        languages: PropTypes.array.isRequired,
        res: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        enableMultipleResources: PropTypes.bool.isRequired,
    };

    hasContentOrOutline(res) {
        return (isTextProfile(res.profile.mediaType) && res.content) ||
               (isArchiveProfile(res.profile.mediaType) && res.outline);
    }

    showContentOrOutline(res) {
        let state = this.state.showContentOrOutline;
        if (res.specialResourceType === 'EXTRACTED_TEXT') {
            state = !state; // flip defaults for text resources
        }
        return state;
    }

    render() {
        const res = this.props.res;
        const actions = this.props.actions;
        const hasContentOrOutline = this.hasContentOrOutline(res);
        const showContentOrOutline = hasContentOrOutline && this.showContentOrOutline(res);

        const toggleContentButton = hasContentOrOutline ?
            <a className="btn btn-xs btn-default" style={{fontSize:'75%', verticalAlign: "baseline"}}
                onClick={e => this.setState({showContentOrOutline:!this.state.showContentOrOutline})} >
                { showContentOrOutline ? "Hide content" : "Show content" }
            </a> : false;

        const toggleCompressButton = isCompressedProfile(res.profile.mediaType) ?
            <a className="btn btn-xs btn-default" style={{fontSize:'75%', verticalAlign: "baseline"}}
                onClick={e => actions.extractCompressedResource(res)} >
                Uncompress
            </a> : false;

        const showExtractTextButton = hasExtractableTextProfile(res.profile.mediaType) && !res.isSource;
        const extractTextButton = showExtractTextButton ?
            <a className="btn btn-xs btn-default" style={{fontSize:'75%', verticalAlign: "baseline"}}
                onClick={e => actions.toggleTextExtraction(res)} >
                Extract Text
            </a> : false;
        const revertToOriginalButton = res.originalResource ?
            <a className="btn btn-xs btn-default" onClick={e => actions.toggleTextExtraction(res)}
                style={{verticalAlign: "baseline"}}>
                Revert to original
            </a> : false;
        const extractedTextWarning = res.specialResourceType === 'EXTRACTED_TEXT' ?
            <div className="warning">
                ⚠️ This text was automatically extracted and may be incomplete or contain errors.
                {"  "} {revertToOriginalButton}
            </div> : false;

        const removeButton = (this.props.enableMultipleResources || res.sourceID) ?
            <a onClick={e => actions.removeResource(res)}>
                <span className={"glyphicon glyphicon-trash"}
                    style={{fontSize:'80%', marginLeft: 10}} aria-hidden="true"/>
            </a> : false;

        const resClass = `row indent${res.indent}` +
            (res.isSource ? " disabled" : "") +
            (res.specialResourceType === 'EXTRACTED_TEXT' ? " extracted" : "");

        const resourceName = res.specialResourceType === 'EXTRACTED_TEXT' ? "Extracted Text" : res.filename;

        return <div className={resClass}>
                <div className={res.isSource ? "col-md-12" : "col-md-5"}>
                    <div className="value namesize">
                        <a href={res.originalLink || res.localLink} title="Click to download" style={{marginRight:10}}>
                            {resourceName}
                        </a>
                        <span style={{fontSize:'66%'}} style={{marginRight:10}}>{humanSize(res.fileLength)}</span>
                        {toggleContentButton}
                        {toggleCompressButton}
                        {extractTextButton}
                        {removeButton}
                    </div>
                </div>
                {extractedTextWarning && <div className="col-md-12 visible-xs visible-sm">{extractedTextWarning}</div>}
                { showContentOrOutline ?
                    <div className="col-md-12 visible-xs visible-sm">
                        <ContentOrOutline res={res} actions={actions}
                            enableMultipleResources={this.props.enableMultipleResources} />
                    </div> : false
                }
                { res.isSource ? false :
                    <React.Fragment>
                    <div className="col-md-4">
                        <div className="row">
                            <div className="col-xs-4 col-md-12 resource-header">Mediatype</div>
                            <div className="col-xs-8 col-md-12 value">
                                <SelectMediatype res={res} mediatypes={this.props.mediatypes}
                                    onMediatype={v => actions.setResourceProfile(res.id, 'mediaType', v.value)}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="row">
                            <div className="col-xs-4 col-md-12 resource-header">Language</div>
                            <div className="col-xs-8 col-md-12 value">
                                <SelectLanguage res={res} languages={this.props.languages}
                                    onLanguage={v => actions.setResourceProfile(res.id, 'language', v.value)}/>
                            </div>
                        </div>
                    </div>
                    </React.Fragment>
                }
                {extractedTextWarning && <div className="col-md-12 hidden-xs hidden-sm">{extractedTextWarning}</div>}
                { showContentOrOutline ?
                    <div className="col-md-12 hidden-xs hidden-sm">
                        <ContentOrOutline res={res} actions={actions}
                            enableMultipleResources={this.props.enableMultipleResources} />
                    </div> : false
                }
            </div>
    }
}

class SelectionResource extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        mediatypes: PropTypes.array.isRequired,
        languages: PropTypes.array.isRequired,
        res: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        enableMultipleResources: PropTypes.bool.isRequired,
    };

    render() {
        const res = this.props.res;
        const actions = this.props.actions;
        return (
            <div key={res.id} className="row">
                <div className="col-md-8">
                    <div className="row">
                        <div className="col-xs-12 namesize content">
                            <BlurableTextInput value={res.content}
                                onChange={text => actions.setResourceContent(res.id, text)}/>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="row">
                        <div className="col-xs-4 col-md-12 resource-header">Language</div>
                        <div className="col-xs-8 col-md-12 value">
                            <SelectLanguage res={res} languages={this.props.languages}
                                onLanguage={v => actions.setResourceProfile(res.id, 'language', v.value)}/>
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

    static propTypes = {
        mediatypes: PropTypes.array.isRequired,
        languages: PropTypes.array.isRequired,
        enableMultipleResources: PropTypes.bool.isRequired,
        resourceList: PropTypes.array.isRequired,
        actions: PropTypes.object.isRequired,
    };

    renderResource(res) {
        if (res.isDictionaryResource) {
            return <SelectionResource
                        mediatypes={this.props.mediatypes}
                        languages={this.props.languages}
                        res={res}
                        actions={this.props.actions}
                        enableMultipleResources={this.props.enableMultipleResources} />
        }
        if (res.profile) {
            return <NormalResource
                        mediatypes={this.props.mediatypes}
                        languages={this.props.languages}
                        res={res}
                        actions={this.props.actions}
                        enableMultipleResources={this.props.enableMultipleResources} />
        }
        return (
            <div className={`row indent${res.indent}`}>
                <div className="col-md-4">
                    <div className="value namesize">
                        <span>{(res.sourceID || res.originalResource) ? "Extracting..." : "Uploading..."}</span>
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
