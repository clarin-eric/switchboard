import React from 'react';
import Tool from './Tool.jsx';

export default class TaskOrientedView extends React.Component {
    constructor(props) {
	super(props);

	this.state = {
	    toolsPerTask: props.toolsPerTask || {}
	};
    }

    render() {
	const toolsPerTask = this.state.toolsPerTask;
	return (
	    <div className="task-oriented-view-container">
	    <h2>Task-Oriented Tool View </h2>
	      { Object.keys(toolsPerTask).map((task) =>
	      <h3 className="taskHead" key={task}>{task}
		<hr />
  		<Tool key={task} lane={this.props.lane} items={toolsPerTasks[task]} />
              </h3>
	      )}
	    </div>
	)
    }
}

