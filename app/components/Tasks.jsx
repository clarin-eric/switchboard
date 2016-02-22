import React from 'react';
import Task from './Task.jsx';

export default ({tasks}) => {
  return (
      <div className="tasks">{Object.keys(tasks).map((task) =>
	  <div className="task">{task}
  	    <Task className="task" key={tasks[task]} items={tasks[task]} />
	  </div>
    )}</div>
  );
}
