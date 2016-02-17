import AltContainer from 'alt-container';
import React from 'react';

import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';

import LaneActions from '../actions/LaneActions';
import LaneStore from '../stores/LaneStore';

import ToolActions from '../actions/ToolActions';
import ToolStore from '../stores/ToolStore';

import Editable from './Editable.jsx';
import ReactTooltip from 'react-tooltip';

export default class Tool extends React.Component {
    constructor(props) {
	super(props);

	const id = props.tool.id;

	this.invokeTool = this.invokeTool.bind(this, id);
    }
    
  render() {
    const {tool, ...props} = this.props;

    return (
      <div {...props}>
        <div className="tool-header">
          <Editable className="tool-name" 
                    value={tool.name}  />
	  <div className="lane-add-note">
            <button onClick={this.invokeTool} > @ </button>
            <p data-tip={tool.longDescription}> Info </p>
            <ReactTooltip />	
           </div>
	</div>
	<div>{tool.task}</div>
	
        <AltContainer
          stores={[NoteStore]}
          inject={{
            notes: () => NoteStore.get(tool.notes)
          }}
        >
          <Notes
            onValueClick={this.activateNoteEdit}
            onEdit={this.editNote}
            onDelete={this.deleteNote} />
        </AltContainer>
      </div>
    );
  }

    // todo: construct URL
    invokeTool(toolId) {

	console.log('Tool/invokeTool at the very start', toolId);
	
	//var myLane = LaneActions.getLane( laneId );
	var entireState = LaneStore.getState();
	var filename =  entireState.selectedLane[0].name;
	console.log("Tool.jsx/invokeTool fetching active lane", entireState, entireState.selectedLane[0], filename );
	
	ToolActions.getTool( toolId );
	
	var entireState = ToolStore.getState();
	var tool = entireState.selectedTool[0];

	console.log('Tool/invokeTool ToolStore state:', entireState, tool);

	// needs to be overwritten
	// var inputFile = tool.parameter.input;
	var inputFile = "http://shannon.sfs.uni-tuebingen.de:8011/" + filename;
	
	var parameterString = "?input=" + inputFile + "&lang=" + tool.parameter.lang + "&analysis=" + tool.parameter.analysis;
	console.log("Tool.jsx/invokeTool: parameterString", parameterString);

	var urlWithParameters = tool.url + parameterString;
	
	var win = window.open(urlWithParameters, '_blank');
	win.focus();
    }
}
