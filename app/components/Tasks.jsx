import React from 'react';
import Task from './Task.jsx';

export default ({tasks}) => {
  return (
      <div className="task-oriented-view-container">{Object.keys(tasks).map((task) =>
	     <h3 className="taskHead" key={task}>{task}
	     <hr />
  	       <Task key={task} items={tasks[task]} />
             </h3>
    )}</div>
  );
}
