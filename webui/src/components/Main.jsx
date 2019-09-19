import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import {Resource} from './Resource';
import {ToolListWithControls} from './ToolList';
import {clientPath} from '../constants';


export class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const hash = location.hash;
        if (hash.startsWith("#/") && hash.length > 2) {
            const [origin, url, mimetype, language] = hash.substring(2).split("/");
            if (origin && url) {
                this.props.uploadLink(
                    decodeURIComponent(url),
                    decodeURIComponent(origin));
            } else {
                // todo: error???
            }
        }
    }

    render() {
        return (
            <div className="main">
                { this.props.resource.state === 'uploading'
                    ? <Uploading/>
                    : this.props.resource.state === 'stored'
                        ? <Analysis {...this.props}/>
                        : <Home/>
                }
            </div>
        );
    }
}


const Home = () => (
    <div className="jumbotron">
        <h2>Switchboard</h2>
        <p>
            Switchboard helps you find tools that can process your resources.
        </p>
        <p>
            The data will be shared with the tools via public links. For more details, see the <Link to={clientPath.faq}>FAQ</Link>.
        </p>

        <Link className="btn btn-lg btn-primary" to={clientPath.input}>Upload files or text</Link>
        <span style={{margin:4}}/>
        <Link className="btn btn-lg btn-default" to={clientPath.tools}>Tools inventory</Link>
    </div>
);

const Uploading = () => (
    <div>
        <h2>Input Analysis</h2>
        <p className="alert alert-info">Uploading data ...</p>
    </div>
);

const Analysis = (props) => (
    <div>
        <h2>Input Analysis</h2>
        <Resource {...props} />
        <hr/>

        <MatchingTools matchingTools={props.matchingTools} resource={props.resource} />
    </div>
);

const MatchingTools = (props) => {
    const tools = props.matchingTools.tools;
    if (tools === undefined)
        return "";
    if (tools === null)
        return <h3 className="smooth-update">Searching...</h3>;
    if (!tools.length)
        return <h3 className="smooth-update">No matching tools found.</h3>;

    return <div className="smooth-update">
        <ToolListWithControls title="Matching Tools" tools={tools} resource={props.resource}/>
    </div>;
};
