// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: Resources.jsx
// Time-stamp: <2018-09-26 10:24:47 (zinn)>
// -------------------------------------------

import React from 'react';
import Resource from './Resource.jsx';

export default class Resources extends React.Component {
    constructor(props) {
	super(props);
    }

    render() {
	const resources = this.props.resources;
	const passToolsChangeToParent = this.props.passToolsChangeToParent;

	return (
     		<div className="resources">


	    { resources.length > 0 ? <h3 id="resourceHeading">Input Analysis</h3> : null }
	    
	    {resources.map((resource) =>
			     <Resource className="resource"
			               passToolsChangeToParent = {passToolsChangeToParent}
             		               key  = {resource.id}
			               resource = {resource}
			           />
			     )
	    }
	    </div>
	);
    }
}
