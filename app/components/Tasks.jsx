import React from 'react';
import Task from './Task.jsx';

export default ({tasks}) => {
  return (
      <div className="task-oriented-view-container">{Object.keys(tasks).map((task) =>
	     <h3 key={task}>{task}
  	       <Task key={task} items={tasks[task]} />
             </h3>
    )}</div>
  );
}
