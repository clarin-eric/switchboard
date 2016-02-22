import React from 'react';
import ReactTooltip from 'react-tooltip';

export default ({items}) => {
    console.log('Task.jsx', items);
    return (
	<div className="task-header">{items.map((item) =>
	    <div className="task-name"> {item.name}
              <button onClick={this.invokeTool} > @ </button>
              <p data-tip={tool.longDescription}> Info </p>
              <ReactTooltip />		    
	    </div>
    )}</div>
  );
}
