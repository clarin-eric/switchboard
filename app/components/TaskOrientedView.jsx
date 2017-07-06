import React from 'react';
import Tool from './Tool.jsx';

export default class TaskOrientedView extends React.Component {
    constructor(props) {
	super(props);
    }

    render() {
	const toolsPerTask = this.props.toolsPerTask;
	const resource = this.props.resource;
	return (
	    <div className="task-oriented-view-container">
	    <h2>Task-Oriented Tool View </h2>
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

