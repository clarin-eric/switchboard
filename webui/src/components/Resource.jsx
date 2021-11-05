import SI from 'seamless-immutable';
import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { processMediatype, humanSize, isCompressedProfile, hasExtractableTextProfile, isTextProfile, isArchiveProfile } from '../actions/utils';
import { InputContainer } from '../containers/InputContainer';


function SelectLanguage({languages, res, onLanguage}) {
    const value = languages.find(x => x.value == res.profile.language);
    return <Select value={value} options={languages.asMutable()}
        onChange={onLanguage} placeholder="Select the language of the resource"
    />;
}
SelectLanguage.propTypes = {
    languages: PropTypes.array.isRequired,
    res: PropTypes.object.isRequired,
    onLanguage: PropTypes.func.isRequired,
}


function SelectMediatype({mediatypes, res, onMediatype}) {
    const options = mediatypes.asMutable();
    let value = mediatypes.find(x => x.value == res.profile.mediaType);
    if (res.profile.mediaType && !value) {
        value = processMediatype(res.profile.mediaType);
        if (value) {
            options.unshift(value);
        }
    }

    return <Select value={value} options={options}
        onChange={onMediatype} placeholder="Select the mediatype of the resource"/>;
}
SelectMediatype.propTypes = {
    mediatypes: PropTypes.array.isRequired,
    res: PropTypes.object.isRequired,
    onMediatype: PropTypes.func.isRequired,
}


function BlurableTextInput({value, onChange}) {
    const inputRef = React.useRef(null);

    return (
        <input type="text" ref={inputRef} value={value}
            onChange={e=>onChange(e.target.value)}
            onKeyDown={e => {if (e.keyCode == 13) inputRef.current.blur() }}/>
    );
}
BlurableTextInput.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};


function ArchiveEntry({res, entry, enableMultipleResources, toggleArchiveEntryToInputs}) {
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


function ContentOrOutline({res, actions, enableMultipleResources}) {
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
                            enableMultipleResources={enableMultipleResources}
                            toggleArchiveEntryToInputs={actions.toggleArchiveEntryToInputs} />
                    )}
                    {res.outlineIsIncomplete ? <span>...</span> : false}
                </div> : false
            }
        </div>
    );
}
ContentOrOutline.propTypes = {
    res: PropTypes.object.isRequired,
    enableMultipleResources: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
};


const commonPropTypes = {
    mediatypes: PropTypes.array.isRequired,
    languages: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    enableMultipleResources: PropTypes.bool.isRequired,
};
const resourcePropTypes = Object.assign({}, commonPropTypes,
    {res: PropTypes.object.isRequired});

function NormalResource({mediatypes, languages, res, actions, enableMultipleResources})  {
    const [compactDesign, setCompactDesign] = React.useState(false);
    const handleResize = () => setCompactDesign(window.innerWidth < 992);
    React.useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    });

    const hasContentOrOutline = (isTextProfile(res.profile.mediaType) && res.content) ||
                                (isArchiveProfile(res.profile.mediaType) && res.outline);

    const showContentOrOutlineDefault =
        hasContentOrOutline && res.specialResourceType === 'EXTRACTED_TEXT';
    const [showContentOrOutline, setShowContentOrOutline] =
        React.useState(showContentOrOutlineDefault);

    const toggleContentButton = hasContentOrOutline ?
        <a className="btn btn-xs btn-default" style={{fontSize:'75%', verticalAlign: "baseline"}}
            onClick={e => setShowContentOrOutline(!showContentOrOutline)} >
            { showContentOrOutline ? "Hide content" : "Show content" }
        </a> : false;

    const uncompressButton = isCompressedProfile(res.profile.mediaType) ?
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

    const removeButton = (enableMultipleResources || res.sourceID) ?
        <a onClick={e => actions.removeResource(res)}>
            <span className={"glyphicon glyphicon-trash"}
                style={{fontSize:'80%', marginLeft: 10}} aria-hidden="true"/>
        </a> : false;

    const resClass = `resource row indent${res.indent}` +
        (res.isSource ? " disabled" : "") +
        (res.specialResourceType === 'EXTRACTED_TEXT' ? " extracted" : "");

    const resourceName = res.specialResourceType === 'EXTRACTED_TEXT' ? "Extracted Text" : res.filename;

    const warningAndContentOrOutline = (
        <>
            { extractedTextWarning ?
                <div className="col-md-12"> {extractedTextWarning} </div> : false
            }
            { showContentOrOutline ?
                <div className="col-md-12">
                    <ContentOrOutline res={res} actions={actions}
                        enableMultipleResources={enableMultipleResources} />
                </div> : false
            }
        </>
    );

    const mediatypeAndLanguage = (
        <>
            <div className="col-md-4">
                <div className="row">
                    <div className="col-xs-4 col-md-12 resource-header">Mediatype</div>
                    <div className="col-xs-8 col-md-12 value">
                        <SelectMediatype res={res} mediatypes={mediatypes}
                            onMediatype={v => actions.setResourceProfile(res.id, 'mediaType', v.value)}/>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="row">
                    <div className="col-xs-4 col-md-12 resource-header">Language</div>
                    <div className="col-xs-8 col-md-12 value">
                        <SelectLanguage res={res} languages={languages}
                            onLanguage={v => actions.setResourceProfile(res.id, 'language', v.value)}/>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div className={resClass}>
            <div className={res.isSource ? "col-md-12" : "col-md-5"}>
                <div className="value namesize">
                    <a href={res.originalLink || res.localLink} title="Click to download" style={{marginRight:10}}>
                        {resourceName}
                    </a>
                    <span style={{fontSize:'66%'}} style={{marginRight:10}}>{humanSize(res.fileLength)}</span>
                    {toggleContentButton}
                    {uncompressButton}
                    {extractTextButton}
                    {removeButton}
                </div>
            </div>
            { compactDesign && warningAndContentOrOutline }
            { !res.isSource && mediatypeAndLanguage }
            { !compactDesign && warningAndContentOrOutline }
        </div>
    );
}
NormalResource.propTypes = resourcePropTypes;


function SelectionResource({mediatypes, languages, res, actions, enableMultipleResources}) {
    return (
        <div key={res.id} className="resource row">
            <div className="col-md-8">
                <div className="row">
                    <div className="col-xs-12 namesize content selection">
                        <BlurableTextInput value={res.content}
                            onChange={text => actions.setResourceContent(res.id, text)}/>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="row">
                    <div className="col-xs-4 col-md-12 resource-header">Language</div>
                    <div className="col-xs-8 col-md-12 value">
                        <SelectLanguage res={res} languages={languages}
                            onLanguage={v => actions.setResourceProfile(res.id, 'language', v.value)}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
SelectionResource.propTypes = resourcePropTypes;


function Resource(props) {
    const {res} = props;
    if (res.isDictionaryResource) {
        return <SelectionResource {...props}/>
    }
    if (res.profile) {
        return <NormalResource {...props} />
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
Resource.propTypes = resourcePropTypes;


export function ResourceList(props) {
    const {mediatypes, languages, enableMultipleResources, resourceList, actions} = props;
    const [showAddMoreDataPane, setShowAddMoreDataPane] = React.useState(false);

    const renderAddMoreDataPane = () => {
        return (
            <div className="more-data-pane">
                <InputContainer title="Add another resource" onSubmit={() => setShowAddMoreDataPane(false)}/>
                <a onClick={e => setShowAddMoreDataPane(false)} className="btn btn-default" style={{float:'right'}}>
                    <span className={"glyphicon glyphicon-remove"} aria-hidden="true"/>
                    {" "}Dismiss
                </a>
                <div style={{clear:'both'}}/>
           </div>
        );
    }

    const renderAddResourceButton = () => {
        return (
            <div className="more-data-button">
                <a onClick={e => setShowAddMoreDataPane(true)} style={{float:'right'}}>
                    <span className={"glyphicon glyphicon-plus"} aria-hidden="true"/>
                    {" "}Add another resource
                </a>
            </div>
        );
    }

    const isDict = resourceList.every(res => res.isDictionaryResource);
    return <>
        <div className="resourceList">
            <div className="row hidden-xs">
                <div className="col-md-12">
                    <h2>Resources</h2>
                </div>
            </div>
            {resourceList.map(r => <Resource key={r.id} res={r} {...props}/>)}
        </div>
        { showAddMoreDataPane ?
            renderAddMoreDataPane() :
            (enableMultipleResources && !isDict ? renderAddResourceButton() : false)
        }
        <div style={{clear:'both'}}/>
    </>;
}
ResourceList.propTypes = Object.assign({}, commonPropTypes, {resourceList: PropTypes.array.isRequired});
