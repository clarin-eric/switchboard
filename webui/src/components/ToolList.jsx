import React from 'react';
import PropTypes from 'prop-types';
import { processLanguage, image } from '../actions/utils';
import { getInvocationURL } from '../actions/toolcall';

export class ToolList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groupByTask: true
        };
    }
    static propTypes = {
        tools: PropTypes.array
    };

    renderToolSections() {
        if (!this.state.groupByTask) {
            return <ToolSubList tools={this.props.tools.asMutable()} showTask={true} resource={this.props.resource}/>;
        }

        const reduceFn = (buckets, tool) => {
            const list = buckets[tool.task] || [];
            list.push(tool);
            buckets[tool.task] = list;
            return buckets;
        }
        const buckets = this.props.tools.asMutable().reduce(reduceFn, {});
        const tasks = Object.keys(buckets).sort();
        return tasks.map(task => <ToolSubList key={task} task={task} tools={buckets[task]} showTask={false} resource={this.props.resource} />);
    }

    render() {
        return (
            <div>
                <form className="input-group" style={{float:'right'}}>
                    <input type="checkbox" name="groupByTask" onChange={toggle.bind(this, 'groupByTask')} checked={this.state.groupByTask} />
                    <label className="form-check-label" htmlFor="groupByTask" style={{marginLeft:4}}>Group by task</label>
                    {/*<input className="form-control" type="text" placeholder="Search for ..."/>*/}
                </form>
                {this.renderToolSections()}
            </div>
        );
    }
}

export class ToolSubList extends React.Component {
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

    render(tools) {
        const sortFn = (t1, t2) => t1.name < t2.name ? -1 : t1.name == t2.name ? 0 : 1;
        const sorted = this.props.tools.sort(sortFn);
        return (
            <div className="tool-sublist" onClick={toggle.bind(this, 'show')}>
                { this.props.task ? <h3>{this.props.task}</h3> : false}
                { !this.state.show ? false : sorted.map(tool =>
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
                <DetailsRow title="Output Format"summary={tool.output.join(', ')} />

                <DetailsRow title="Licence" summary={tool.licence} />

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