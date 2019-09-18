import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import {Resource} from './Resource';
import {ToolListWithControls} from './ToolList';
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
        return <h3 className="smooth-update">Searching...</h3>;
    if (!tools.length)
        return <h3 className="smooth-update">No matching tools found.</h3>;

    return <div className="smooth-update">
        <ToolListWithControls title="Matching Tools" tools={tools} resource={props.resource}/>
    </div>;
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
                        <h2>Input Analysis</h2>
                        <Resource resource={this.props.resource}
                            updateResource={this.props.updateResource}
                            mediatypes={this.props.mediatypes}
                            languages={this.props.languages} />

                        <hr/>

                        <MatchingTools matchingTools={this.props.matchingTools} resource={this.props.resource} />
                    </div>
                }
            </div>
        );
    }
}
