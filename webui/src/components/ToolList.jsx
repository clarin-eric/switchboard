import React from 'react';
import PropTypes from 'prop-types';
import { processLanguage, image } from '../actions/utils';
import { getInvocationURL } from '../actions/toolcall';

export class ToolList extends React.Component {
    render() {
        const tools = this.props.tools;
        const sorted = tools.asMutable().sort((t1, t2) => t1.name < t2.name ? -1 : t1.name == t2.name ? 0 : 1);
        return (
            <React.Fragment>
                { sorted.map(tool =>
                    <ToolCard key={tool.name}
                        imgSrc={image(tool.logo)}
                        showDetails={this.props.showDetails}
                        tool={tool}
                        resource={this.props.resource}/>
                )}
            </React.Fragment>
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

    renderHeader(imgSrc, tool, invocationURL) {
        return (
            <dl className="dl-horizontal">
                <dt><img src={imgSrc}/></dt>
                <dd>
                    { invocationURL
                        ? <a className="btn btn-success" style={{marginRight:16}} href={invocationURL} target="_blank"> Start Tool </a>
                        : false
                    }
                    <a style={{fontSize: 24}} href={tool.homepage} target="_blank">{tool.name}</a>
                    <div style={{fontSize:14}}>
                        { tool.deployment && tool.deployment !== 'production'
                            ? <Indicator title="warning-sign">{tool.deployment}</Indicator>
                            : false
                        }
                    </div>
                </dd>
            </dl>
        );
    }

    renderDetails(tool) {
        return (
            <div>
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
                </IndicatorRow>
                <hr/>
            </div>
        );
    }

    render() {
        const invocationURL = getInvocationURL(this.props.tool, this.props.resource);
        return (
            <div className="tool" onClick={e => this.setState({showDetails:!this.state.showDetails})}>
                { this.renderHeader(this.props.imgSrc, this.props.tool, invocationURL) }
                { this.state.showDetails ? this.renderDetails(this.props.tool) : false }
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

