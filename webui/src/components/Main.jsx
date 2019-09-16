import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import {Resource} from './Resource';
import {ToolList} from './ToolList';
import {clientPath} from '../constants';

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


const MatchingTools = (props) => {
    const tools = props.matchingTools.tools;
    if (tools === undefined)
        return "";
    if (tools === null)
        return <div key="0" className="smooth-update">Searching...</div>;
    if (!tools.length)
        return <div key="1" className="smooth-update">No matching tools found.</div>;

    return <div key="2" className="smooth-update"> <ToolList tools={tools} resource={props.resource}/> </div>;
};


export class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="main">
                { !this.props.resource.file
                    ? <Home/>
                    : <div>
                        <h3>Input Analysis</h3>
                        <Resource resource={this.props.resource}
                            updateResource={this.props.updateResource}
                            mediatypes={this.props.mediatypes}
                            languages={this.props.languages} />

                        <hr/>

                        <h3>Matching tools</h3>
                        <MatchingTools matchingTools={this.props.matchingTools} resource={this.props.resource} />
                    </div>
                }
            </div>
        );
    }
}
