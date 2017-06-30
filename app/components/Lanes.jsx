import React from 'react';
import Lane from './Lane.jsx';

export default class Lanes extends React.Component {
    constructor(props) {
	super(props);
	console.log('Lanes/constructor', props);
    }

    render() {
	const lanes = this.props.lanes;
	const passChangeToParent = this.props.passChangeToParent;

	console.log('Lanes/render', passChangeToParent);
	return (
		<div className="lanes">
		  {lanes.map((lane) =>
			     <Lane className="lane"
			           passChangeToParent = {passChangeToParent}
             		           key  = {lane.id}
			           lane = {lane}
			           />
			    )}
	    </div>
	);
    }
}
