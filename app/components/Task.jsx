import React from 'react';
import ToolActions from '../actions/ToolActions';
import ToolStore from '../stores/ToolStore';
import LaneActions from '../actions/LaneActions';
import LaneStore from '../stores/LaneStore';
import ReactTooltip from 'react-tooltip';

export default class Task extends React.Component {
    constructor(props) {
	super(props);

	this.invokeTaskTool = this.invokeTaskTool.bind(this);
    }
    
  render() {
    const {items, ...props} = this.props;

      return (
	  <div className="task-header">{items.map((item) =>
	      <div className="task-name">
	      <p>
	      <span className="alignLeft"> {item.name} </span>
	      <span className="alignRight">
                <span data-tip={item.longDescription}> Info </span>
                <ReactTooltip />
              <button onClick={this.invokeTaskTool.bind(this,item)} > @ </button>
	      </span>
	      </p>
	      </div>
	)}</div>
    );
  }

    invokeTaskTool(item) {

	// the location for the server holding temporarily the resources
	var nodeServerURL = "http://shannon.sfs.uni-tuebingen.de:8011/";
	// var nodeServerURL = "http://localhost:8011/";	

	console.log('Task.jsx/invokeTaskTool at the very start', item);

	var entireState = LaneStore.getState();
	var filename =  entireState.selectedLane[0].name;
	console.log("Task.jsx/invokeTaskTool fetching active lane", entireState, entireState.selectedLane[0], filename );

	
	var inputFile = nodeServerURL + filename;
	
	var parameterString = "?input=" + inputFile + "&lang=" + item.parameter.lang + "&analysis=" + item.parameter.analysis;
	console.log("Task.jsx/invokeTaskTool: parameterString", parameterString);

	var urlWithParameters = item.url + parameterString;
	
	var win = window.open(urlWithParameters, '_blank');
	win.focus();
    }
}
