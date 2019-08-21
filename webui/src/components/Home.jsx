import React from 'react';
import {Dropzone} from './Dropzone';
import {Link} from 'react-router-dom';

export const Home = (props) => (
    <div className="home">
        <h3>Home</h3>
        <p>
            The Switchboard helps you find tools that can process your resources.
        </p>
        <p>
            The data will be shared with the tools via public links. For more details, see the FAQ.
        </p>
        <Link to="/input">Upload files or text</Link>
    </div>
);
