// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: TaskOrientedView.jsx
// Time-stamp: <2018-09-24 20:52:30 (zinn)>
// -------------------------------------------

import React from 'react';
import Tool from './Tool.jsx';
import Toggle   from 'react-toggle';               

export default class TaskOrientedView extends React.Component {
    constructor(props) {
	super(props);
        this.handleChange = this.handleChange.bind(this);
	this.propagateValues = this.props.passChangeToParent;
    }

    handleChange (event) {
	console.log('TaskOrientedView/handleChange', event, this.propagateValues);
	if (event.target.checked === true) {
	    document.getElementById("toolHeading").innerHTML = 'Tools and Web Services';
	} else {
	    document.getElementById("toolHeading").innerHTML = 'Tools';	    
	}
	this.propagateValues(event);
    }

    render() {
	const toolsPerTask = this.props.toolsPerTask;
	const resource = this.props.resource;
	console.log('TaskOrientedView/render', toolsPerTask);
	return (
		<div className="task-oriented-view-container">
		{ Object.keys(toolsPerTask).length ?
		  <div>
		    <h3 id="toolHeading"> Tools </h3>
		    <h5 className="text-left">(ordered by task)</h5>
		    <h5 className="text-left">
		      <Toggle
			defaultChecked={false}
			onChange={this.handleChange} />
		    </h5>
		  </div>
		  : null }
		
		{ Object.keys(toolsPerTask).map((task) =>
	      <h3 className="taskHead" key={task}>{task}
		<hr />
  		<Tool key={task} resource={resource} items={toolsPerTask[task]} />
              </h3>
	      )}
	    </div>
	    )
    }
}

