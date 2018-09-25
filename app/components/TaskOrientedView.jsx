// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: TaskOrientedView.jsx
// Time-stamp: <2018-09-25 15:12:31 (zinn)>
// -------------------------------------------

import React from 'react';
import Tool from './Tool.jsx';
import Toggle   from 'react-toggle';
import { SegmentedControl } from 'segmented-control-react';

 const segments1 = [
	{ name: 'Only Tools' },
	{ name: 'Both Tools & Web Services' },
	{ name: 'Only Web Services' }
 ];

 const segments2 = [
	{ name: 'Order by tasks' },
	{ name: 'Order alphabetically' }
 ];

   
export default class TaskOrientedView extends React.Component {

   
    constructor(props) {
	super(props);
        this.handleChange = this.handleChange.bind(this);
	this.propagateValues = this.props.passChangeToParent;
	this.handleSegChange1 = this.handleSegChange1.bind(this);
	this.handleSegChange2 = this.handleSegChange2.bind(this);	

	this.state = {
	    segments1: segments1,
	    segments2: segments2,	    
	    selected1: 0,
	    selected2: 0
	};	
    }

    handleSegChange1(index) {
	console.log(`selected index for inclusion: ${index}`);
    }

    handleSegChange2(index) {
	console.log(`selected index for ordering: ${index}`);
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
		    <table width="800px">
		      <td>
			<SegmentedControl
			  segments={this.state.segments1}
			  selected={this.state.selected1} 
			  variant="base"
			  onChangeSegment={this.handleSegChange1}           
			  />
		      </td>
		      <td>
			<SegmentedControl
			  segments={this.state.segments2}
			  selected={this.state.selected2} 
			  variant="base"
			  onChangeSegment={this.handleSegChange2}           
			  />
		      </td>
		    </table>
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

