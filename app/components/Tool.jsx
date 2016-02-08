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
            value={tool.name} 
            />
	    <div className="lane-add-note">
              <button onClick={this.invokeTool}>@</button>
            </div>
        </div>
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

	console.log('Tool/invokeTool at start', toolId);	
	// this updates the state in lanes store (adding selected lanes)
	ToolActions.getTool( toolId );
	
	var entireState = ToolStore.getState();
	var tool = entireState.selectedTool[0];

	console.log('Tool/invokeTool', entireState, tool);
	var win = window.open(tool.url, '_blank');
	win.focus();
    }
}
