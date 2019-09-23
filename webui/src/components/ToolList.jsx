import React from 'react';
import PropTypes from 'prop-types';
import { processLanguage, image } from '../actions/utils';
import { getInvocationURL } from '../actions/toolcall';


export class ToolListWithControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groupByTask: true,
            searchString: "",
        };
    }
    static propTypes = {
        title: PropTypes.string,
        tools: PropTypes.array,
        resource: PropTypes.object,
    };

    filterTools(tools, searchString) {
        if (searchString.length < 2) {
            return {tools, hiddenTools:[]};
        }
        const terms = searchString.trim().split(/\s/);
        const ret = {tools: [], hiddenTools: []};
        tools.forEach(tool => {
            if (terms.every(term => tool.searchString.includes(term))) {
                ret.tools.push(tool);
            } else {
                ret.hiddenTools.push(tool);
            }
        });
        return ret;
    }

    renderGroupByTask() {
        return (
            <div style={{display:'inline-block', marginRight:20}}>
                <form className="input-group">
                    <input type="checkbox" id="groupByTask" name="groupByTask"
                        onChange={toggle.bind(this, 'groupByTask')} checked={this.state.groupByTask} />
                    <label className="form-check-label" htmlFor="groupByTask" style={{marginLeft:4, fontWeight:500}}>Group by task</label>
                </form>
            </div>
        );
    }

    renderSearch() {
        return (
            <div style={{display:'inline-block', marginRight:20}}>
                <form className="search" className="input-group">
                    <input className="form-control" type="text" placeholder="Search for ..."
                        onChange={e => this.setState({searchString: event.target.value})}
                        value={this.state.searchString} />
                    <span className="input-group-addon" style={{width:'1em'}}>
                        <span className="glyphicon glyphicon-search" style={{fontSize:'90%'}} aria-hidden="true"/>
                    </span>
                </form>
            </div>
        );
    }

    render() {
        const {tools, hiddenTools} = this.filterTools(this.props.tools, this.state.searchString);
        return (
            <div>
                <h2 style={{float:'left'}}>{this.props.title}</h2>

                <div className="tool-control" style={{float:'right', marginTop: 20}}>
                    {this.renderGroupByTask()}
                    {this.renderSearch()}
                </div>

                <div style={{clear:'both'}} />

                <ToolList tools={tools} resource={this.props.resource} {...this.state}/>

                { hiddenTools.length
                    ? <p className="alert alert-info">There are {hiddenTools.length} tools not matching the search term.</p>
                    : false
                }
            </div>
        );
    }
}


class ToolList extends React.Component {
    static propTypes = {
        tools: PropTypes.array,
        resource: PropTypes.object,
        groupByTask: PropTypes.bool,
    };

    render() {
        if (!this.props.groupByTask) {
            return <ToolSubList tools={this.props.tools} showTask={true} resource={this.props.resource}/>;
        }

        const reduceFn = (buckets, tool) => {
            const list = buckets[tool.task] || [];
            list.push(tool);
            buckets[tool.task] = list;
            return buckets;
        }
        const buckets = this.props.tools.reduce(reduceFn, {});
        const tasks = Object.keys(buckets).sort();
        return tasks.map(task => <ToolSubList key={task} task={task} tools={buckets[task]} showTask={false} resource={this.props.resource} />);
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
        tools: PropTypes.array,
        task: PropTypes.string,
        showTask: PropTypes.bool,
        resource: PropTypes.object,
    };

    render() {
        const sortFn = (t1, t2) => t1.name < t2.name ? -1 : t1.name == t2.name ? 0 : 1;
        const tools = [...this.props.tools].sort(sortFn);
        return (
            <div className="tool-sublist" onClick={toggle.bind(this, 'show')}>
                { this.props.task
                    ? <h3> {this.props.task} {this.state.show ? false : " ..."} </h3>
                    : false
                }
                { !this.state.show ? false : tools.map(tool =>
                    <ToolCard key={tool.name}
                        imgSrc={image(tool.logo)}
                        showTask={this.props.showTask}
                        tool={tool}
                        resource={this.props.resource}/>
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
        tool: PropTypes.object,
        showTask: PropTypes.bool,
        resource: PropTypes.object,
        imgSrc: PropTypes.string
    };

    renderHeader(imgSrc, tool, invocationURL) {
        return (
            <dl className="dl-horizontal header">
                <dt><img src={imgSrc}/></dt>
                <dd>
                    { invocationURL
                        ? <a className="btn btn-success" style={{marginRight:16}} href={invocationURL} target="_blank"> Start Tool </a>
                        : false
                    }
                    <a style={{fontSize: 20}} href={tool.homepage} target="_blank">{tool.name}</a>
                </dd>
            </dl>
        );
    }

    renderDetails(tool, showTask) {
        return (
            <div>
                { showTask ? <DetailsRow title="Task" summary={tool.task} /> : false }
                <DetailsRow title="Description" summary={tool.description} />
                { tool.authentication == "no" ? null :
                    <DetailsRow title="Authentication" summary={tool.authentication} />
                }
                <DetailsRow title="Input Format" summary={tool.mimetypes.join(", ")} />
                <DetailsRow title="Language(s)" summary={tool.languages.map(l => (processLanguage(l) || {label:l}).label).join(", ")} />

                {  tool.license && <DetailsRow title="License" summary={tool.license} /> }

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
        return (
            <div className="tool" onClick={toggle.bind(this, 'showDetails')}>
                { this.renderHeader(this.props.imgSrc, this.props.tool, invocationURL) }
                { this.state.showDetails ? this.renderDetails(this.props.tool, this.props.showTask) : false }
            </div>
        );
    }
};


const DetailsRow = ({ title, summary }) => {
    return !summary ? null : (
        <div style={{alignSelf: 'flex-start'}}>
            <div style={{ width: '100%'}}>
                <dl className="dl-horizontal">
                    <dt>{title}</dt>
                    <dd>{title == "Home"
                        ? <a href={summary} target="_blank"> {summary }</a>
                        : summary }
                    </dd>
                </dl>
            </div>
        </div>
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
        <span style={{marginRight:'1em'}}>
            <span className={"glyphicon glyphicon-"+props.title} style={{fontSize:'90%'}} aria-hidden="true"/>
            {" "}
            {props.children}
        </span>
    );
};


function toggle(name, event) {
    event.stopPropagation();
    this.setState({[name]: !this.state[name]});
}