// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: TaskOrientedView.jsx
// Time-stamp: <2018-10-04 11:07:23 (zinn)>
// -------------------------------------------

import React from 'react';
import Tool from './Tool.jsx';
import Toggle   from 'react-toggle';
import { SegmentedControl } from 'segmented-control-react';

import { TOOLTYPE_TOOLS_ONLY, TOOLTYPE_TOOLS_PLUS_WEBSERVICES, TOOLTYPE_WEBSERVICES_ONLY,
	 TOOLORDER_BY_TOOL_TASK, TOOLORDER_BY_TOOL_NAME
       } from './../back-end/util';

const toolTypeSegments = [
	{ name: 'Only Tools' },
	{ name: 'Both Tools & Web Services' },
	{ name: 'Only Web Services' }
 ];

const toolOrderSegments = [
	{ name: 'Sort by Task' },
	{ name: 'Order Alphabetically' }
 ];
   
export default class TaskOrientedView extends React.Component {
   
    constructor(props) {
	super(props);
	this.handleToolTypeChange  = this.handleToolTypeChange.bind(this);
	this.handleToolOrderChange = this.handleToolOrderChange.bind(this);
	this.groupTools = this.groupTools.bind(this);
	this.sieve = this.sieve.bind(this);
	
	this.state = {
	    toolType:  TOOLTYPE_TOOLS_ONLY,
	    toolOrder: TOOLORDER_BY_TOOL_TASK
	};	
    }

    sieve(tool) {
	var result = true;
	
	switch (this.state.toolType) {
	case TOOLTYPE_TOOLS_ONLY:
	    result = ( tool.softwareType == "webService" ? false : true)
	    break;
	case TOOLTYPE_TOOLS_PLUS_WEBSERVICES:
	    result = true;
	    break;
	default: // TOOLTYPE_WEBSERVICES_ONLY
	    result = ( tool.softwareType == "webService" ? true : false)
	}
	return result;
    }
    

    handleToolTypeChange(index) {
	console.log(`TaskOrientedView/handleToolTypeChange: selected index for inclusion: ${index}`);
	this.setState( {toolType: index} );			
    }

    handleToolOrderChange(index) {
	console.log(`TaskOrientedView/handleToolOrderChange: selected index for ordering: ${index}`);
	this.setState( {toolOrder: index} );				
    }

    groupTools( tools ){

	var toolGroups = {};

	for (var i = 0; i<tools.length; i++) {
	    const entry = tools[i];

	    // defines the registry entries visible to the outside
	    const toolInfo = [ {
		name            : entry.name,
		logo            : entry.logo,
		description     : entry.description,
		homepage        : entry.homepage,
		url             : entry.url,
		location        : entry.location,
		authentication  : entry.authentication,
		id              : entry.id,
		email           : entry.contact.email,
		parameters      : entry.parameters,
		langEncoding    : entry.langEncoding,
		output          : entry.output,
		softwareType    : entry.softwareType,
		requestType     : entry.requestType,
		mapping         : entry.mapping,
	    } ];

	    if (entry.task in toolGroups) {
		toolGroups[ entry.task ] = toolGroups[ entry.task ].concat( toolInfo );
	    } else {
		toolGroups[ entry.task ] = [].concat( toolInfo );		
	    }
	}
	return toolGroups;
    }
    
    
    render() {
	const tools = this.props.tools;
	const toolsAfterFilter = tools.filter( this.sieve );

	toolsAfterFilter.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)); 
	
	const toolsPerTask = this.groupTools(toolsAfterFilter);
	var toolsPerAlphabet = {}
	if ( toolsAfterFilter.length ) {
	    toolsPerAlphabet["Alphabetical Order"] = toolsAfterFilter;
	}
	
	const resource = this.props.resource;
	
	console.log('TaskOrientedView/re-rendering', this.state, toolsAfterFilter);
	return (
		<div className="task-oriented-view-container">
		  { toolsAfterFilter.length ?
		  <div>
		    <h3 id="toolHeading"> Tools </h3>
		    <table width="800px">
		      <tbody>
			<tr>
			  <td>
			    <SegmentedControl
			      segments={toolTypeSegments}
			      selected={this.state.toolType} 
			      variant="dark"
			      onChangeSegment={this.handleToolTypeChange}           
			      />
			  </td>
			  <td>
			    <SegmentedControl
			      segments={toolOrderSegments}
			      selected={this.state.toolOrder} 
			      variant="dark"
			      onChangeSegment={this.handleToolOrderChange}           
			      />
			  </td>
			</tr>
		      </tbody>
		    </table>
	            </div>
		    : null }
		    
	    { this.state.toolOrder == TOOLORDER_BY_TOOL_TASK ?
	      <div>
	      {	
		  Object.keys(toolsPerTask).map((task, index) =>
						      <h3 className="taskHead" key={task}>{task}
						      <hr />
  						      <Tool key={index} resource={resource} items={toolsPerTask[task]} />
						      </h3>
					       )
	      }
	      </div> :
	      <div>
	      {	
		  Object.keys(toolsPerAlphabet).map((task, index) =>
						      <h3 className="taskHead" key={task}>{task}
						      <hr />
  						      <Tool key={index} resource={resource} items={toolsPerAlphabet[task]} />
						      </h3>
					       )
	      }	      

	      </div>
	    }
	    </div>		
	    )
    }
}

