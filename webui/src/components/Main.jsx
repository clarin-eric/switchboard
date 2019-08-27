import React from 'react';
import {Link} from 'react-router-dom';
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
            The data will be shared with the tools via public links. For more details, see the FAQ.
        </p>

        <Link className="btn btn-lg btn-primary" to={clientPath.input}>Upload files or text</Link>
    </div>
);

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
                        <ToolList tools={this.props.matchingTools}/>
                    </div>
                }
            </div>
        );
    }
}
