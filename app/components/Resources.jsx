import React from 'react';
import Resource from './Resource.jsx';

export default class Resources extends React.Component {
    constructor(props) {
	super(props);
	console.log('Resources/constructor', props);
    }

    render() {
	const resources = this.props.resources;
	const passChangeToParent = this.props.passChangeToParent;

	console.log('Resources/render', passChangeToParent);
	return (
		<div className="resources">
		  {resources.map((resource) =>
			     <Resource className="resource"
			               passChangeToParent = {passChangeToParent}
             		               key  = {resource.id}
			               resource = {resource}
			           />
			    )}
	    </div>
	);
    }
}
