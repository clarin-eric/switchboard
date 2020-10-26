import React from 'react';
import PropTypes from 'prop-types';
import { makeHighlighter } from './Highlighter.jsx';
import { processLanguage, image } from '../actions/utils';
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
            const isFullMatch = resourceCount == 0 || tool.bestMatchPercent == 100 && tool.inputs.length == resourceCount;
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
                <input type="checkbox" id="groupByTask" name="groupByTask"
                    onChange={toggle.bind(this, 'groupByTask')} checked={this.state.groupByTask} />
                <input type="text" placeholder="Search for tool"
                    onChange={this.setSearch} value={this.state.searchString} />
            </form>
        );
    }

    render() {
        const resourceLength = this.props.resourceList ? this.props.resourceList.length : 0;
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
                    <div>
                        { hiddenTools.length > 0 &&
                            <p className="alert alert-info">There are {hiddenTools.length} tools not matching the search term.</p>
                        }
                        { tools.length == 0 && hiddenTools.length == 0 &&
                            <p className="alert alert-info">There are no tools perfectly matching the resource(s).</p>
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
                            { hiddenPartial.length
                                ? <p className="alert alert-info">There are {hiddenPartial.length} tools not matching the search term.</p>
                                : false
                            }
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

    renderHeader(imgSrc, tool, invocationURL) {
        const trackCall = (e) => {
            e.stopPropagation();
            _paq.push(['trackEvent', 'Tools', 'StartTool', tool.name]);
        }
        const Highlighter = this.props.highlighter;
        return (
            <div className="toolheader" onClick={toggle.bind(this, 'showDetails')}>
                <div className="img-holder hidden-xs"><img src={imgSrc}/></div>
                <Indicator className="tool-chevron" title={"menu-" + (this.state.showDetails ? "down":"right")}/>
                { invocationURL
                    ? <a className="btn btn-success" onClick={e => trackCall(e, tool)} href={invocationURL} target="_blank">
                        Open <Indicator className="tool-starter" title={"new-window"}/>
                      </a>
                    : false
                }
                <div className="name-and-badges">
                    <span style={{fontSize:"120%"}}><Highlighter text={tool.name}/></span>
                    <div className="badges">
                        { !tool.authentication || tool.authentication == "no" ? null
                            : <div className="badge-holder auth" title="This tool requires a user account. Please check the Authentication information for more details.">
                                <span className={"fa fa-key"} style={{padding:"6px 6px"}} aria-hidden="true"/>
                            </div> }
                        { !tool.standaloneApplication ? null
                            : <div className="badge-holder standalone" title="This tool requires local installation on one of your devices, please check the details.">
                                <span className={"fa fa-download"} style={{padding:"6px 6px"}} aria-hidden="true"/>
                            </div> }
                    </div>
                </div>
            </div>
        );
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
                    (x,i) => <p key={i}><a href={x}>{x}</a></p> )}
                {this.renderDetailRowArray("Download URL", standalone.downloadURL,
                    (x,i) => <p key={i}>{x.type}: <a href={x.url}>{x.url}</a></p> )}
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
                            {tool.matches && !(tool.bestMatchPercent == 100 && this.props.resourceList.length == 1) &&
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
        const invocationURL = tool.invokeMatchIndex >= 0 &&
            getInvocationURL(tool, this.props.resourceList, tool.matches[tool.invokeMatchIndex]);
        const toolClassName = invocationURL ? "tool match" : "tool";
        return (
            <div className={toolClassName}>
                { this.renderHeader(this.props.imgSrc, tool, invocationURL) }
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
        return <p key={i}>Input {input.name ? <em><strong>{input.name}</strong></em> : false} {text}</p>
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
                        { tool.inputs.map((input, inputIndex) =>
                            <span key={inputIndex}>
                                {" "}
                                Input
                                {" "}
                                {input.name && <span className="resource-index">{input.name}</span>}
                                {" "}
                                {match[inputIndex] < 0 ?
                                    'does not match any resource.' :
                                    `matches resource no. ${match[inputIndex] + 1}.`
                                }
                            </span>)
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
            <dt>{"Input " + (input.name ? `[${input.name}]` : "")}</dt>
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
