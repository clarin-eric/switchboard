import React from 'react';
import Tool from './Tool.jsx';

export default ({tools}) => {
  return (
    <div className="tools">{tools.map((tool) =>
      <Tool className="tool" key={tool.tid} tool={tool} />
    )}</div>
  );
}
