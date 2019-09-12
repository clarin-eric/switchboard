import React from 'react';
import PropTypes from 'prop-types';
import { map639_3_to_639_1, image } from '../actions/utils';

const styles = {
    image: {
        height: 32,
        margin: '4px 4px 4px 0',
        padding: 2,
        border: '1px solid #ddd',
        boxShadow: '2px 2px 2px #ccc',
    },
};


const ToolCard = (props) => {
    // todo: fix this
    // const fullURL = gatherInvocationParameters(props, resource);
    const fullURL = "";
    const outputFormats = (props.output === undefined) || ((props.output instanceof Array) && props.output.join(', ')) || props.output;
    const startButton = fullURL
        ? <button className="btn-info btn-lg" style={{marginLeft:16}} onClick={this.invokeTool.bind(this, fullURL)}> Click to start tool </button>
        : false;

    return (
        <div style={{ position: 'relative', top: 0, marginTop: 10 }}>
            <dl className="dl-horizontal" style={{marginBottom:10, marginTop:32}}>
                <dt><img style={styles.image} src={props.imgSrc}/></dt>
                <dd><a style={{fontSize: 24}} href={props.homepage}>{props.name}</a>
                    { startButton }
                </dd>
            </dl>
            <div>
                <DetailsRow title="Description" summary={props.description} />
                { props.authentication == "no" ? null :
                    <DetailsRow title="Authentication" summary={props.authentication} />
                }
                <DetailsRow title="Output Format"summary={outputFormats} />
                <DetailsRow title="Location" summary={props.location} />
            </div>
            <hr/>
        </div>
    )
};


const DetailsRow = ({ title, summary }) => {
    return !summary ? null : (
        <div style={{alignSelf: 'flex-start'}}>
            <div style={{ width: '100%'}}>
                <dl className="dl-horizontal" style={{marginBottom:10}}>
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

export class ToolList extends React.Component {
    render() {
        const tools = this.props.tools;
        const sorted = tools.asMutable().sort((t1, t2) => t1.name < t2.name ? -1 : t1.name == t2.name ? 0 : 1);
        return (
            <React.Fragment>
                { sorted.map(tool => <ToolCard key={tool.name} imgSrc={image(tool.logo)} {...tool}/>) }
            </React.Fragment>
        );
    }
}
