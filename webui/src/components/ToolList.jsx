import React from 'react';
import PropTypes from 'prop-types';
import { makeHighlighter } from './Highlighter.jsx';
import { processLanguage, image, humanSize, findAllIndices } from '../actions/utils';
import { getInvocationURL } from '../actions/toolcall';
import { apiPath } from '../constants';

const SPACE_REGEX = /\s/;


export class ToolListWithControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groupByTask: true,
            searchString: "",
            searchTerms: [],
        };
        this.setSearch = this.setSearch.bind(this);
    }
    static propTypes = {
        title: PropTypes.string.isRequired,
        tools: PropTypes.array.isRequired,
        resourceList: PropTypes.array,
        selectResourceMatch: PropTypes.func,
    };

    setSearch(event) {
        const searchString = event.target.value;
        let searchTerms = [];
        if (searchString.length >= 2) {
            searchTerms = searchString.trim().toLowerCase().split(SPACE_REGEX);
        }
        this.setState({searchString, searchTerms});
    }

    filterTools(tools, resourceCount, searchString, searchTerms) {
        const ret = {tools: [], hiddenTools: [], partial: [], hiddenPartial: []};
        tools.forEach(tool => {
            const isFullMatch = resourceCount == 0 || tool.mandatoryInputsMatchPercent == 100 && tool.profileMatchPercent == 100;
            if (searchString.length < 2 || searchTerms.every(term => tool.searchString.includes(term))) {
                if (isFullMatch) {
                    ret.tools.push(tool);
                } else {
                    ret.partial.push(tool);
                }
            } else {
                if (isFullMatch) {
                    ret.hiddenTools.push(tool);
                } else {
                    ret.hiddenPartial.push(tool);
                }
            }
        });
        return ret;
    }

    renderControls() {
        return (
            <form className="controls">
                <label htmlFor="groupByTask">Group by task</label>
                <input type="checkbox" className="group-by-task" id="groupByTask" name="groupByTask"
                    onChange={toggle.bind(this, 'groupByTask')} checked={this.state.groupByTask} />
                <input type="text" className="search-box" placeholder="Search for tool"
                    onChange={this.setSearch} value={this.state.searchString} />
            </form>
        );
    }

    render() {
        const resourceLength = (this.props.resourceList || []).filter(r => !r.isSource).length;
        const {tools, hiddenTools, partial, hiddenPartial} = this.filterTools(
            this.props.tools, resourceLength, this.state.searchString, this.state.searchTerms);
        return (
            <div className="tool-list-with-controls">
                <div>
                    <h2 style={{float:'left'}}>{this.props.title}</h2>
                    <div style={{float:'right'}}>
                        {this.renderControls()}
                    </div>
                </div>
                <div style={{clear:'both'}}/>
                <div className="row">
                    <div className="col-md-12">
                        <ToolList tools={tools} resourceList={this.props.resourceList}
                                  groupByTask={this.state.groupByTask}
                                  highlighter={makeHighlighter(this.state.searchTerms)}
                                  selectResourceMatch={this.props.selectResourceMatch}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        { hiddenTools.length > 0 ?
                            <p className="alert alert-info" style={{marginTop:20}}>
                                There are {hiddenTools.length} tools not matching the search term.
                            </p> : false
                        }
                        { tools.length == 0 && hiddenTools.length == 0 ?
                            <p className="alert alert-info" style={{marginTop:20}}>
                                There are no tools perfectly matching the resource(s).
                            </p> : false
                        }
                    </div>
                </div>
                { partial.length || hiddenPartial.length ?
                    <React.Fragment>
                        <div>
                            <h2 style={{float:'left', marginTop:32}}>Partial matches</h2>
                        </div>
                        <div style={{ clear:"both"}}/>
                        <div className="row">
                            <div className="col-md-12">
                                <ToolList tools={partial} resourceList={this.props.resourceList}
                                          groupByTask={this.state.groupByTask}
                                          highlighter={makeHighlighter(this.state.searchTerms)}
                                          selectResourceMatch={this.props.selectResourceMatch}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                { hiddenPartial.length ?
                                    <p className="alert alert-info" style={{marginTop:20}}>
                                        There are {hiddenPartial.length} tools not matching the search term.
                                    </p> : false
                                }
                            </div>
                        </div>
                    </React.Fragment> : false
                }
            </div>
        );
    }
}


class ToolList extends React.Component {
    static propTypes = {
        tools: PropTypes.array.isRequired,
        resourceList: PropTypes.array,
        groupByTask: PropTypes.bool.isRequired,
        highlighter: PropTypes.func.isRequired,
        selectResourceMatch: PropTypes.func,
    };

    render() {
        if (!this.props.groupByTask) {
            return <ToolSubList tools={this.props.tools} showTask={true}
                                resourceList={this.props.resourceList}
                                highlighter={this.props.highlighter}
                                selectResourceMatch={this.props.selectResourceMatch} />;
        }

        const reduceFn = (buckets, tool) => {
            const list = buckets[tool.task] || [];
            list.push(tool);
            buckets[tool.task] = list;
            return buckets;
        }
        const buckets = this.props.tools.reduce(reduceFn, {});
        const tasks = Object.keys(buckets).sort();
        return tasks.map(task => <ToolSubList key={task} task={task} tools={buckets[task]} showTask={false}
                                              resourceList={this.props.resourceList}
                                              highlighter={this.props.highlighter}
                                              selectResourceMatch={this.props.selectResourceMatch} />);
    }
}


class ToolSubList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true
        };
    }
    static propTypes = {
        tools: PropTypes.array.isRequired,
        task: PropTypes.string,
        showTask: PropTypes.bool.isRequired,
        resourceList: PropTypes.array,
        highlighter: PropTypes.func.isRequired,
        selectResourceMatch: PropTypes.func,
    };

    render() {
        const taskChevron = {
            fontSize: "80%",
            marginRight: 0
        };

        const sortFn = (t1, t2) => t1.name < t2.name ? -1 : t1.name == t2.name ? 0 : 1;
        const tools = [...this.props.tools].sort(sortFn);
        const Highlighter = this.props.highlighter;
        return (
            <div className="tool-sublist" >
                { !this.props.task ? false :
                    <h3 onClick={toggle.bind(this, 'show')}>
                        <span className="section-left-padding hidden-xs"/>
                        <Indicator title={"menu-" + (this.state.show ? "down":"right")} style={taskChevron}/>
                        <Highlighter text={this.props.task}/>
                    </h3>
                }
                { !this.state.show ? false : tools.map(tool =>
                    <ToolCard key={tool.name}
                        imgSrc={apiPath.logo(tool.logo)}
                        showTask={this.props.showTask}
                        tool={tool}
                        resourceList={this.props.resourceList}
                        highlighter={this.props.highlighter}
                        selectResourceMatch={
                            this.props.selectResourceMatch && this.props.selectResourceMatch.bind(this, tool.name)
                        }/>
                )}
            </div>
        );
    }
}

class ToolCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDetails: false
        };
    }
    static propTypes = {
        tool: PropTypes.object.isRequired,
        showTask: PropTypes.bool.isRequired,
        resourceList: PropTypes.array,
        selectResourceMatch: PropTypes.func,
        imgSrc: PropTypes.string.isRequired,
        highlighter: PropTypes.func.isRequired,
    };

    renderInvocationButton(tool, invocationURL, error) {
        const isManual = tool.webApplication && tool.webApplication.manualParameters;
        const btnClass = `open btn ${isManual ? "btn-default" : "btn-success"}`;
        const btnText = isManual ? "Go to site" : "Open";

        const trackCall = (e) => {
            e.stopPropagation();
            _paq.push(['trackEvent', 'Tools', 'StartTool', tool.name]);
        }

        if (invocationURL) {
            return (
                <a className={btnClass} onClick={trackCall} href={invocationURL} target="_blank">
                    {btnText}
                    <Indicator className="tool-starter" title={"new-window"}
                               style={{marginLeft:'0.5em', marginRight:0}}/>
                </a>
            );
        } else if (error) {
            return (
                <span className="error">
                    <span className={"glyphicon glyphicon-alert"} aria-hidden="true"/>
                    {error}
                </span>
            );
        }
        return false;
    }

    renderHeader(imgSrc, tool, invocationURL, error) {
        const Highlighter = this.props.highlighter;
        const isManual = tool.webApplication && tool.webApplication.manualParameters;
        const manualHelpText = "The Switchboard cannot automatically send the data to this web application. Please download the resources locally and upload them manually in the web applications' environment";
        return <div style={{display:'flex'}} onClick={toggle.bind(this, 'showDetails')}>
            <div className="img-holder hidden-xs"><img src={imgSrc}/></div>
            <Indicator className="tool-chevron" title={"menu-" + (this.state.showDetails ? "down":"right")}/>
            <div className="toolheader"
                title={isManual ? manualHelpText : ""}>
                <div className="toolname">
                    <span style={{fontSize:"120%"}}><Highlighter text={tool.name}/></span>
                </div>
                <div className="badges">
                    {this.renderInvocationButton(tool, invocationURL, error)}
                    { !isManual ? null
                        : <div className="badge-holder manual" title={manualHelpText}>
                            <span className={"fa fa-file-upload"} aria-hidden="true" style={{padding: '6px 8px', fontSize:'100%'}}/>
                            <span> Requires data upload</span>
                        </div> }
                    { !tool.authentication || tool.authentication == "no" ? null
                        : <div className="badge-holder auth" title="This tool requires a user account. Please check the Authentication information for more details.">
                            <span className={"fa fa-key"} aria-hidden="true"/>
                            <span> Requires authentication</span>
                        </div> }
                    { !tool.standaloneApplication ? null
                        : <div className="badge-holder standalone" title="This tool requires local installation on one of your devices, please check the details.">
                            <span className={"fa fa-desktop"} aria-hidden="true"/>
                            <span> Desktop application</span>
                        </div> }
                    { tool?.webApplication?.url?.startsWith("http://") ?
                        <div className="badge-holder unsafe" title="The connection to this tool is not secure. Unauthorized 3rd parties can potentially access the resource while we transfer it to the tool.">
                            <span className={"fa fa-exclamation-triangle"}/>
                            <span> Not secure</span>
                        </div>: null }
                </div>
            </div>
        </div>;
    }

    renderUsageRestrictions(tool) {
        const Highlighter = this.props.highlighter;
        if (!tool.usageRestrictions) {
            return false;
        }
        const individuals = tool.usageRestrictions.individualUserRestrictions || {};
        const notSupported = tool.usageRestrictions.countriesNotSupported || {};
        const supported = tool.usageRestrictions.countriesSupported || {};

        if (!individuals.length && !notSupported.length && !supported.length) {
            return false;
        }

        return (
            <React.Fragment>
                <dt>Restrictions</dt>
                <dd>
                    {individuals.length &&
                        <React.Fragment>
                            <div className="row">
                            <div className="col-sm-4 inputclass">Individual User Restrictions</div>
                            <div className="col-sm-8">{individuals}</div>
                            </div>
                        </React.Fragment>
                    }
                    {notSupported.length &&
                        <React.Fragment>
                            <div className="row">
                            <div className="col-sm-4 inputclass">Countries Not Supported</div>
                            <div className="col-sm-8">{notSupported}</div>
                            </div>
                        </React.Fragment>
                    }
                    {supported.length &&
                        <React.Fragment>
                            <div className="row">
                            <div className="col-sm-4 inputclass">Countries Supported</div>
                            <div className="col-sm-8">{supported}</div>
                            </div>
                        </React.Fragment>
                    }
                </dd>
            </React.Fragment>
        );
    }

    renderWebApp(tool) {
        if (!tool.webApplication) {
            return false;
        }
        const webapp = tool.webApplication;
        const Highlighter = this.props.highlighter;
        return (
            <React.Fragment>
                {  webapp.browserRequirements &&
                    <DetailsRow title="Browser Requires"
                                summary={<Highlighter markdown={webapp.browserRequirements}/>} />
                }
                {  webapp.applicationSuite &&
                    <DetailsRow title="Application Suite"
                                summary={<Highlighter markdown={webapp.applicationSuite}/>} />
                }
                {  webapp.scalabilityType &&
                    <DetailsRow title="Scalability"
                                summary={<Highlighter markdown={webapp.scalabilityType}/>} />
                }
                {  webapp.licenceInformation &&
                    <DetailsRow title="Licence Information"
                                summary={<Highlighter markdown={webapp.licenceInformation}/>} />
                }
            </React.Fragment>
        );
    }

    renderDetailRow(title, text) {
        const Highlighter = this.props.highlighter;
        return text && text.length > 0 &&
            <DetailsRow title={title} summary={<Highlighter markdown={text}/>} />
    }

    renderDetailRowArray(title, arr, f) {
        const Highlighter = this.props.highlighter;
        return arr && arr.length > 0 &&
            <React.Fragment>
                <dt>{title}</dt>
                <dd>{arr.map(f)}</dd>
            </React.Fragment>
    }

    renderStandaloneApp(tool) {
        if (!tool.standaloneApplication) {
            return false;
        }
        const standalone = tool.standaloneApplication;
        const Highlighter = this.props.highlighter;

        return (
            <React.Fragment>
                {this.renderDetailRowArray("Available on Device", standalone.availableOnDevice,
                    (x,i) => <p key={i}>{x}</p> )}
                {this.renderDetailRowArray("Installation URL", standalone.installURL,
                    (x,i) => <p key={i}><a href={x} target="_blank">{x}</a></p> )}
                {this.renderDetailRowArray("Download URL", standalone.downloadURL,
                    (x,i) => <p key={i}>{x.type}: <a href={x.url} target="_blank">{x.url}</a></p> )}
                {this.renderDetailRow("Application Suite", standalone.applicationSuite)}
                {this.renderDetailRow("Feature List", standalone.featureList)}
                {this.renderDetailRow("Permissions", standalone.permissions)}
                {this.renderDetailRow("Release Notes", standalone.releaseNotes)}
                {this.renderDetailRow("SoftwareAddOn", standalone.softwareAddOn)}
                {this.renderDetailRow("Software Requirements", standalone.softwareRequirements)}
                {this.renderDetailRow("Supporting Data", standalone.supportingData)}
                {this.renderDetailRow("Data Transfer", standalone.dataTransfer)}
                {this.renderDetailRowArray("Licence Information", standalone.licenseInformation,
                    (x,i) => <p key={i}>{x}</p> )}
                {  this.renderRuntimeInformation(tool, standalone.runtimeInformation) }
            </React.Fragment>
        );
    }

    renderRuntimeInformation(tool, runtime) {
        if (!tool || !runtime) {
            return false;
        }
        const Highlighter = this.props.highlighter;
        return (
            <React.Fragment>
                {this.renderDetailRow("Memory Requirements", runtime.memoryRequirements)}
                {this.renderDetailRow("Storage Requirements", runtime.storageRequirements)}
                {this.renderDetailRow("Processor Requirements", runtime.processorRequirements)}
                {this.renderDetailRowArray("Operating System", runtime.operatingSystem,
                    (x,i) => <p key={i}>{
                        x.name +
                        (x.versionFrom || x.versionTo ? ` ${x.versionFrom||""} - ${x.versionTo||""}` : "")
                    }</p> )}
                {this.renderDetailRow("File Size", runtime.fileSize)}
                {this.renderDetailRowArray("Installation Licence", runtime.installationLicense,
                    (x,i) => <p key={i}>{x}</p> )}
                {this.renderDetailRowArray("Runtime Environment", runtime.runtimeEnvironment,
                    (x,i) => <p key={i}>{x}</p> )}
            </React.Fragment>
        );
    }

    renderDetails(tool, showTask, selectResourceMatch) {
        const Highlighter = this.props.highlighter;
        return (
            <div>
                <div style={{alignSelf: 'flex-start'}}>
                    <div style={{ width: '100%'}}>
                        <dl className="dl-horizontal">
                            { showTask ? <DetailsRow title="Task" summary={<p><Highlighter text={tool.task}/></p>} /> : false }
                            <DetailsRow title="Homepage" summary={<Highlighter markdown={tool.homepage}/>} />
                            {tool.keywords ?
                                <KeywordsRow title="Keywords" keywords={tool.keywords.map(kw => <Highlighter text={kw}/>)} />:
                                false }
                            <DetailsRow title="Description" summary={<Highlighter markdown={tool.description}/>} />
                            { tool.creators && tool.creators.length &&
                                <DetailsRow title="Creators" summary={<Highlighter markdown={tool.creators}/>} />
                            }
                            { !tool.authentication || tool.authentication == "no" ? null :
                                <DetailsRow title="Authentication" summary={<Highlighter markdown={tool.authentication}/>} />
                            }
                            { tool.licence && <DetailsRow title="Licence" summary={<Highlighter markdown={tool.licence}/>} /> }

                            { this.renderUsageRestrictions(tool)}

                            {tool.webApplication && this.renderWebApp(tool, selectResourceMatch)}
                            {tool.standaloneApplication && this.renderStandaloneApp(tool)}

                            {tool.inputs &&
                                tool.inputs.map((input, i) => <InputRow  key={input.id || i} input={input}/>)}
                            {tool.matches && (tool.mandatoryInputsMatchPercent < 100 || this.props.resourceList.length > 1) &&
                                <InputMatches tool={tool} selectResourceMatch={selectResourceMatch}/>}
                        </dl>
                    </div>
                </div>


                <IndicatorRow>
                    { tool.version && tool.version !== 'x.y.z'
                        ? <Indicator title="bookmark">{tool.version}</Indicator> : false
                    }
                    <Indicator title="map-marker">{tool.location}</Indicator>
                    { tool.deployment && tool.deployment !== 'production'
                        ? <Indicator title="warning-sign">{tool.deployment}</Indicator>
                        : false
                    }
                </IndicatorRow>
                <hr/>
            </div>
        );
    }

    render() {
        const tool = this.props.tool;
        const {invocationURL, error} = tool.invokeMatchIndex >= 0 && getInvocationURL(tool, this.props.resourceList) || {};
        const toolClassName = invocationURL ? "tool match" : "tool";
        return (
            <div className={toolClassName}>
                { this.renderHeader(this.props.imgSrc, tool, invocationURL, error) }
                { this.state.showDetails ?
                    this.renderDetails(tool, this.props.showTask, this.props.selectResourceMatch) :
                    false }
            </div>
        );
    }
};


const InputMatches = ({tool, selectResourceMatch}) => {
    const ignoreEvent = e => {e.preventDefault(); e.stopPropagation()};
    const inputFn = (input, i) => {
        return <p key={i}>Input {input.id ? <em><strong>{input.id}</strong></em> : false} {text}</p>
    };
    return (
        <React.Fragment>
            <dt>Resource Match</dt>
            <dd>
                { tool.matches.length > 1 ?
                    <span>Multiple resource matches are available, please select one:</span> : null
                }
                { tool.matches.map((match, matchIndex) => {
                    const invokeThis = tool.invokeMatchIndex == matchIndex;
                    return (
                        <div key={matchIndex}>
                        {tool.matches.length <= 1 ? false :
                            <form className="form form-inline" style={{display:'inline-block', paddingRight:4}}>
                                <input type="checkbox" id={"matchIndex"+matchIndex} name={"matchIndex"+matchIndex}
                                    checked={!!invokeThis}
                                    onChange={e => {selectResourceMatch(matchIndex)}} />
                            </form>
                        }
                        { tool.inputs.map((input, inputIndex) => {
                            const usedResources = findAllIndices(match, inputIndex).map(index => index + 1);
                            const usedResourcesString = usedResources.join(", ");
                            return <span key={inputIndex}>
                                {" Input "}
                                <span className="resource-index">{input.id}</span>
                                { usedResources.length == 0 ? ' does not match any resource. ' :
                                  usedResources.length == 1 ? ` matches resource ${usedResourcesString}. `
                                                              : ` matches resources: ${usedResourcesString}. `
                                }
                            </span>
                            })
                        }
                        </div>
                    );
                })}
            </dd>
        </React.Fragment>
    );
}


const InputRow = ({ input }) => {
    const languageLabel = langCode => (processLanguage(langCode) || {label:langCode}).label;

    return (
        <React.Fragment>
            <dt>{"Input " + (input.id ? `[${input.id}]` : "")}</dt>
            <dd>
                <div className="row">
                    <div className="col-sm-2 inputclass">Mediatypes:</div>
                    <div className="col-sm-10">{input.mediatypes.join(", ")}</div>
                </div>
                {!input.languages ? false :
                    <div className="row">
                        <div className="col-sm-2 inputclass">Languages:</div>
                        <div className="col-sm-10">
                            {input.languages === "generic" ?
                                "Any language" :
                                input.languages.map(languageLabel).join(", ")
                            }
                        </div>
                    </div>
                }
                {!input.maxSize ? false :
                    <div className="row">
                        <div className="col-sm-2 inputclass">Max Size:</div>
                        <div className="col-sm-10">{humanSize(input.maxSize)}</div>
                    </div>
                }
                {!input.multiple ? false :
                    <div className="row">
                        <div className="col-sm-2 inputclass">Multiple</div>
                        <div className="col-sm-10">This input slot accepts multiple resources.</div>
                    </div>
                }
            </dd>

        </React.Fragment>
    );
};


const DetailsRow = ({ title, summary }) => {
    return !summary ? null : (
        <React.Fragment>
            <dt>{title}</dt>
            <dd>{summary}</dd>
        </React.Fragment>
    );
};

const KeywordsRow = ({ title, keywords }) => {
    return !keywords ? null : (
        <React.Fragment>
            <dt>{title}</dt>
            <dd> <p> {keywords.map((kw,i) => <span className="keyword" key={i}>{kw}</span>)} </p> </dd>
        </React.Fragment>
    );
};

const IndicatorRow = (props) => {
    return (
        <div style={{alignSelf: 'flex-start'}}>
            <div style={{ width: '100%'}}>
                <dl className="dl-horizontal">
                    <dt></dt>
                    <dd>{props.children}</dd>
                </dl>
            </div>
        </div>
    );
};

const Indicator = (props) => {
    return (
        <span className={props.className||""} style={Object.assign({marginRight:'1em'}, props.style)}>
            <span className={"glyphicon glyphicon-"+props.title} style={{fontSize:'90%'}} aria-hidden="true"/>
            {props.children && props.children.length ? " " : false}
            {props.children}
        </span>
    );
};


function toggle(name, event) {
    event.stopPropagation();
    this.setState({[name]: !this.state[name]});
}
