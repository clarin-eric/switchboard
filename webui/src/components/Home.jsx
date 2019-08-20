import React from 'react';

export const Home = () => (
    <div className="input">
        <h3>Input</h3>
        <p>
            The Switchboard helps you find tools that can process your resources.
        </p>
        <p>
            Your data will be shared with the tools via public links. For more details, see the FAQ.
        </p>
        <form className="input-group">
            <textarea className="form-control inputZone" rows="3" placeholder="Enter text or URL, or drop a file here."/>
            <span className="input-group-addon">
                <button type="submit" className="btn">Submit</button>
            </span>
        </form>
    </div>
);
