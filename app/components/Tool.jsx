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
//import ReactTooltip from 'react-tooltip';

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

    // http://tuebingen.weblicht.sfs.uni-tuebingen.de:8888/weblicht/?input=http://ws1-clarind.esc.rzg.mpg.de/drop-off/storage/rotkaeppchen.txt&lang=de&analysis=dep-parsing
    
    // todo: construct URL
    invokeTool(toolId) {

	// our poor man's upload service (node based)
	// var nodeServerURL = "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8011/";

	// central service
	var nodeServerURL = "http://ws1-clarind.esc.rzg.mpg.de/drop-off/storage/";
	
	console.log('Tool/invokeTool at the very start', toolId);
	
	// fetch the information about the language resource
	var entireState = LaneStore.getState();
	var filename =  entireState.selectedLane[0].name;
	console.log("Tool.jsx/invokeTool fetching active lane", entireState, entireState.selectedLane[0], filename );

	// fetch the information about the selected tool
	ToolActions.getTool( toolId );
	var entireState = ToolStore.getState();
	var tool = entireState.selectedTool[0];
	console.log('Tool/invokeTool ToolStore state:', entireState, tool);

	// needs to be overwritten
	// var inputFile = tool.parameter.input;
	var inputFile = nodeServerURL + filename;

	var parameterNameInput    = "input";
	var parameterNameLanguage = "lang";
	var parameters = tool.parameter;

	var parameterNames = [];
	var first = false;
	var parameterString = "";
	
	for (var parameter in parameters) {
	    if (parameters.hasOwnProperty(parameter)) {
		console.log(parameter + " -> " + parameters[parameter]);
		if (tool.hasOwnProperty('mapping')) {
		    var mapping = tool['mapping'];
		    if (mapping.hasOwnProperty(parameter)) {
			parameterString = parameterString.concat( mapping[parameter]).concat("=").concat(parameters[parameter]);
		    } else {
			parameterString = parameterString.concat( parameter ).concat("=").concat(parameters[parameter]);
		    }
		} else
		    parameterString = parameterString.concat( parameter ).concat("=").concat(parameters[parameter]);
	    }
	}

	alert('Tool.jsx/invokeTool parameterString', parameterString);

	// todo: this only works for weblicht, for the time being. Parameters must be fetched from metadata
	var parameterString = "?input=" + inputFile + "&lang=" + tool.parameter.lang + "&analysis=" + tool.parameter.analysis;
	console.log("Tool.jsx/invokeTool: parameterString", parameterString);

	var urlWithParameters = tool.url + parameterString;
	
	var win = window.open(urlWithParameters, '_blank');
	win.focus();
    }
}
