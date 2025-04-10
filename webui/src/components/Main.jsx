// polyfills for IE 11
import "core-js/stable";
import "regenerator-runtime/runtime";

import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import {ResourceList} from './Resource';
import {ToolListWithControls} from './ToolList';
import {clientPath } from '../constants';


export class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const params = {};
        if (location.hash.startsWith("#/") && location.hash.length > 2) {
            const [origin, url, mimetype, language] = location.hash.substring(2).split("/");
            if (origin && url) {
                params.origin = decodeURIComponent(origin);
                params.url = decodeURIComponent(url);
                if (mimetype || language) {
                    params.profile = {};
                    if (mimetype) {
                        params.profile.mediaType = decodeURIComponent(mimetype);
                    }
                    if (language) {
                        params.profile.language = decodeURIComponent(language);
                    }
                }
            } else {
                console.error("Switchboard: incomplete parameter list");
            }
        }
        for (const [key, value] of new URLSearchParams(location.search)) {
            if (key && value) {
                params[key] = decodeURIComponent(value);
            }
        }
        if (params.url && params.origin) {
            this.props.actions.uploadLink(params);
        }
    }

    render() {
        return (
            <div className="main">
                { this.props.resourceList.length ?
                    <Analysis mediatypes={this.props.mediatypes} languages={this.props.languages}
                              enableMultipleResources={this.props.apiinfo.enableMultipleResources || false}
                              resourceList={this.props.resourceList}
                              matchingTools={this.props.matchingTools}
                              actions={this.props.actions} /> :
                    <Home/>
                }
            </div>
        );
    }
}


const Home = () => (
    <div className="jumbotron">
        <h2>Switchboard</h2>
        <p>
            Switchboard helps you find tools that can process your data.
        </p>
        <p>
            The data will be shared with the tools via public links. For more details, see the <Link to={clientPath.faq}>FAQ</Link>.
        </p>

        <Link className="btn btn-lg btn-primary" to={clientPath.input} style={{margin:4}}>Upload files or text</Link>
        <Link className="btn btn-lg btn-default" to={clientPath.tools} style={{margin:4}}>Tool inventory</Link>
    </div>
);

const Uploading = () => (
    <div>
        <p style={{fontSize:20}}>Uploading data ...</p>
    </div>
);

const Analysis = (props) => (
    <div>
        <ResourceList mediatypes={props.mediatypes} languages={props.languages}
                      enableMultipleResources={props.enableMultipleResources}
                      resourceList={props.resourceList}
                      actions={props.actions} />
        <hr style={{marginTop:0}}/>


        <div className="results smooth-update">
            <MatchingTools matchingTools={props.matchingTools} resourceList={props.resourceList}
                       actions={props.actions} />
        </div>
    </div>
);

const MatchingTools = (props) => {
    const tools = props.matchingTools.tools;
    if (tools === undefined)
        return "";
    if (tools === null)
        return <h3 className="smooth-update">Searching...</h3>;
    if (!tools.length)
        return <div><h3 className="smooth-update">No matching tools found.</h3><p>Try different mediatypes and languages 
        using the options above or submmit a different file.</p></div>;

    return <ToolListWithControls title="Matching Tools"
                tools={tools}
                resourceList={props.resourceList}
                selectResourceMatch={props.selectResourceMatch}/>;
};
