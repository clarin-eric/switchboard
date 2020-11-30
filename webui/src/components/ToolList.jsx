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
        resource: PropTypes.object,
    };

    setSearch(event) {
        const searchString = event.target.value;
        let searchTerms = [];
        if (searchString.length >= 2) {
            searchTerms = searchString.trim().toLowerCase().split(SPACE_REGEX);
        }
        this.setState({searchString, searchTerms });
    }

    filterTools(tools, searchString, searchTerms) {
        if (searchString.length < 2) {
            return {tools, hiddenTools:[]};
        }
        const ret = {tools: [], hiddenTools: []};
        tools.forEach(tool => {
            if (searchTerms.every(term => tool.searchString.includes(term))) {
                ret.tools.push(tool);
            } else {
                ret.hiddenTools.push(tool);
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
        const {tools, hiddenTools} = this.filterTools(this.props.tools, this.state.searchString, this.state.searchTerms);
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
                        <ToolList tools={tools} resource={this.props.resource}
                            groupByTask={this.state.groupByTask}
                            highlighter={makeHighlighter(this.state.searchTerms)}/>

                        { hiddenTools.length
                            ? <p className="alert alert-info">There are {hiddenTools.length} tools not matching the search term.</p>
                            : false
                        }
                    </div>
                </div>
            </div>
        );
    }
}


class ToolList extends React.Component {
    static propTypes = {
        tools: PropTypes.array.isRequired,
        resource: PropTypes.object,
        groupByTask: PropTypes.bool.isRequired,
        highlighter: PropTypes.func.isRequired,
    };

    render() {
        if (!this.props.groupByTask) {
            return <ToolSubList tools={this.props.tools} showTask={true}
                                resource={this.props.resource} highlighter={this.props.highlighter}/>;
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
                                              resource={this.props.resource} highlighter={this.props.highlighter}/>);
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
        resource: PropTypes.object,
        highlighter: PropTypes.func.isRequired,
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
            <div className="tool-sublist" onClick={toggle.bind(this, 'show')} >
                { !this.props.task ? false :
                    <h3>
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
                        resource={this.props.resource}
                        highlighter={this.props.highlighter}/>
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
        resource: PropTypes.object,
        imgSrc: PropTypes.string.isRequired,
        highlighter: PropTypes.func.isRequired,
    };

    renderHeader(imgSrc, tool, invocationURL) {
        const styles = {
            toolChevron: {
                fontSize: "80%",
                marginRight: 0,
                color: '#444'
            },
            toolStartIndicator: {
                marginRight: 0,
                marginLeft: 2,
                fontSize: "90%"
            },
            toolHomeIndicator: {
                marginLeft: 4,
                fontSize: "75%"
            }
        };
        const stopBubbling = (e) => {
            e.stopPropagation();
        }
        const trackCall = (e) => {
            stopBubbling(e);
            _paq.push(['trackEvent', 'Tools', 'StartTool', tool.name]);
        }
        const Highlighter = this.props.highlighter;
        return (
            <div className="toolheader">
                <div className="img-holder hidden-xs"><img src={imgSrc}/></div>
                <Indicator title={"menu-" + (this.state.showDetails ? "down":"right")} style={styles.toolChevron}/>
                { invocationURL
                    ? <a className="btn btn-success" onClick={trackCall} href={invocationURL} target="_blank"
                        >Open <Indicator title={"new-window"} style={styles.toolStartIndicator}/></a>
                    : false
                }
                <div className="name-and-badges">
                    <span style={{fontSize:"120%"}}><Highlighter text={tool.name}/></span>
                    <div className="badges">
                        { !tool.authentication || tool.authentication == "no" ? null
                            : <div className="badge-holder" title="This tool requires a user account. Please check the Authentication information for more details.">
                                <span className={"fa fa-key"} style={{padding:"6px 6px"}} aria-hidden="true"/>
                            </div> }
                    </div>
                </div>
            </div>
        );
        // <div style={{clear:'both'}}/>
    }

    renderDetails(tool, showTask) {
        const Highlighter = this.props.highlighter;
        return (
            <div>
                <div style={{alignSelf: 'flex-start'}}>
                    <div style={{ width: '100%'}}>
                        <dl className="dl-horizontal">
                            { showTask ? <DetailsRow title="Task" summary={<p><Highlighter text={tool.task}/></p>} /> : false }
                            <DetailsRow title="Homepage" summary={<Highlighter markdown={tool.homepage}/>} />
                            <DetailsRow title="Description" summary={<Highlighter markdown={tool.description}/>} />
                            { !tool.authentication || tool.authentication == "no" ? null :
                                <DetailsRow title="Authentication" summary={<Highlighter markdown={tool.authentication}/>} />
                            }

                            <DetailsRow title="Input Format" summary={<p>{tool.mimetypes.join(", ")}</p>} />
                            { tool.languages.length >0 ?
                                <DetailsRow title="Language(s)" summary={<p>{tool.languages.map(l => (processLanguage(l) || {label:l}).label).join(", ")}</p>} /> : null
                            }
                            {  tool.licence && <DetailsRow title="Licence" summary={<Highlighter markdown={tool.licence}/>} /> }
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
        const invocationURL = getInvocationURL(this.props.tool, this.props.resource);
        const toolClassName = invocationURL ? "tool match" : "tool";
        return (
            <div className={toolClassName} onClick={toggle.bind(this, 'showDetails')}>
                { this.renderHeader(this.props.imgSrc, this.props.tool, invocationURL) }
                { this.state.showDetails ? this.renderDetails(this.props.tool, this.props.showTask) : false }
            </div>
        );
    }
};


const DetailsRow = ({ title, summary }) => {
    return !summary ? null : (
        <React.Fragment>
            <dt>{title}</dt>
            <dd>{title == "Home"
                ? <a href={summary} target="_blank"> {summary}</a>
                : summary }
            </dd>
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
        <span style={Object.assign({marginRight:'1em'}, props.style)}>
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
