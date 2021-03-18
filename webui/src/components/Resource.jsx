import React from 'react';
import SI from 'seamless-immutable';
import Select from 'react-select';
import { processMediatype, humanSize } from '../actions/utils';
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


export class ResourceList extends React.Component {
    constructor(props) {
        super(props);
        this.renderResource = this.renderResource.bind(this);
        this.state = {
            showAddMoreDataPane: false,
        }
    }

    renderResourceDetails(res) {
        const removeButton = this.props.resourceList.length > 1 ?
            <a onClick={e => this.props.removeResource(res)}>
                <span className={"glyphicon glyphicon-trash"}
                    style={{fontSize:'80%', marginLeft: 10}} aria-hidden="true"/>
            </a> : false;
        return <div className="row">
                <div className="col-md-4">
                    <div className="value namesize">
                        <a href={res.originalLink || res.localLink} style={{marginRight:10}}> {res.filename}</a>
                        <span style={{fontSize:'66%'}}>{humanSize(res.fileLength)}</span>
                        {removeButton}
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="row">
                        <div className="col-xs-4 col-md-12 resource-header">Mediatype</div>
                        <div className="col-xs-8 col-md-12 value">
                            <SelectMediatype res={res} mediatypes={this.props.mediatypes}
                                onMediatype={v => this.props.setResourceProfile(res.id, 'mediaType', v.value)}/>
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
    }

    renderSelectionResource(res) {
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

    renderResource(res) {
        if (res.isDictionaryResource) {
            return this.renderSelectionResource(res);
        }
        return <React.Fragment key={res.id}>
                {res.profile ?
                    this.renderResourceDetails(res) :
                    <div className="row">
                        <div className="col-md-4">
                            <div className="value namesize">
                                <p>Uploading...</p>
                            </div>
                        </div>
                    </div>
                }
               </React.Fragment>
    }

    renderAddMoreDataPane() {
        return <div className="more-data-pane">
                <InputContainer title="Add another resource" onSubmit={() => this.setState({showAddMoreDataPane:false})}/>
                <a onClick={e => this.setState({showAddMoreDataPane:false})} className="btn btn-default" style={{float:'right'}}>
                    <span className={"glyphicon glyphicon-remove"} aria-hidden="true"/>
                    {" "}Dismiss
                </a>
                <div style={{clear:'both'}}/>
               </div>
    }

    renderAddResourceButton() {
        return <div className="more-data-button">
                <a onClick={e => this.setState({showAddMoreDataPane:true})} style={{float:'right'}}>
                    <span className={"glyphicon glyphicon-plus"} aria-hidden="true"/>
                    {" "}Add another resource
                </a>
               </div>
    }

    render() {
        const isDict = this.props.resourceList.every(res => res.isDictionaryResource);
        return <React.Fragment>
            <div className="resource">
                <div className="row hidden-xs">
                    <div className="col-md-12">
                        <h2>Resources</h2>
                    </div>
                </div>
                {this.props.resourceList.map(this.renderResource)}
            </div>
            { this.state.showAddMoreDataPane ?
                this.renderAddMoreDataPane() :
                (this.props.enableMultipleResources && !isDict ?
                    this.renderAddResourceButton() :
                    false)
            }
            <div style={{clear:'both'}}/>
        </React.Fragment>;
    }
}
