// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: Resources.jsx
// Time-stamp: <2018-09-24 12:08:41 (zinn)>
// -------------------------------------------

import React from 'react';
import Resource from './Resource.jsx';

export default class Resources extends React.Component {
    constructor(props) {
	super(props);
    }

    render() {
	const resources = this.props.resources;
	const passChangeToParent = this.props.passChangeToParent;
	const includeWebServices = this.props.includeWebServices;

	return (
     		<div className="resources">


	    { resources.length > 0 ? <h2 id="resourceHeading">Input Analysis</h2> : null }
	    
	    {resources.map((resource) =>
			     <Resource className="resource"
			               passChangeToParent = {passChangeToParent}
				       includeWebServices = {includeWebServices}
             		               key  = {resource.id}
			               resource = {resource}
			           />
			     )
	    }
	    </div>
	);
    }
}
