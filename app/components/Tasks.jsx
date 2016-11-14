import React from 'react';
import Task from './Task.jsx';

export default ({toolsPerTasks, lane}) => {
  return (
      <div className="task-oriented-view-container">{Object.keys(toolsPerTasks).map((task) =>
	     <h3 className="taskHead" key={task}>{task}
	     <hr />
  	       <Task key={task} lane={lane} items={toolsPerTasks[task]} />
             </h3>
    )}</div>
  );
}
