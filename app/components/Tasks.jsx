import React from 'react';
import Task from './Task.jsx';

export default ({toolsPerTasks}) => {
  return (
      <div className="task-oriented-view-container">{Object.keys(toolsPerTasks).map((task) =>
	     <h3 className="taskHead" key={task}>{task}
	     <hr />
  	       <Task key={task} items={toolsPerTasks[task]} />
             </h3>
    )}</div>
  );
}
