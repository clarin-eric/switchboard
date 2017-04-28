import AltContainer from 'alt-container';
import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import LaneActions from '../actions/LaneActions';
import LaneStore from '../stores/LaneStore';
import ToolActions from '../actions/ToolActions';
import ToolStore from '../stores/ToolStore';
import Toggle   from 'react-toggle';                

export default class Lane extends React.Component {
    constructor(props) {
	super(props);
	
	const lane = props.lane;
	const id = lane.id;
	
	this.displayTools            = this.displayTools.bind(this, lane);
	this.getFileUrl              = this.getFileUrl.bind(this, lane);
	this.handleWebServicesChange = this.handleChange.bind(this, 'includeWebServices')

	this.state = {
	    includeWebServices: false
	};

    }
    render() {
	const {lane, ...props} = this.props;
	return (
	    <div {...props}>
  	      <div className="lane-header">
  	        <a className="lane-name"
	           href='#' onClick={this.getFileUrl}
		   >
	    	   <span>Link to Resource</span>
		</a>
		  <Toggle
	             defaultChecked={false}
	             onChange={this.handleWebServicesChange} />	    
	        <div className="lane-add-note">
  	          <button id="showToolsButton" onClick={this.displayTools}>Show Tools</button>
	        </div>
	      </div>
	      <AltContainer stores={[NoteStore]}
			    inject={{ notes: () => NoteStore.get(lane.notes) }} >
		<Notes />
	      </AltContainer>
	    </div>
	);
    }

    handleChange (key, event) {
	this.setState({ [key]: event.target.checked }, function () {
	    console.log('now, the state has changed...:', key, event, this.state.includeWebServices);
	});
	if (event.target.checked === true) {
	    document.getElementById("showToolsButton").innerHTML = 'Show Tools and Web Services';
	} else {
	    document.getElementById("showToolsButton").innerHTML = 'Show Tools';	    
	}
    }
    
    displayTools(lane) {

	console.log('Lane.jsx/displayTools',
		    'webservices:', this.state.includeWebServices,
		    'resource:', lane);
	
	
	if (lane.language == null) {
	    alert('CLRS: Please identify the language of the resource!');
	    return;
	}

	if (lane.mimetype == null) {
	    alert('CLRS: Please identify the mimetype of the resource!');
	    return;
	}
	
	ToolActions.findTools( lane, this.state.includeWebServices );
    }

    getFileUrl(lane) {
	console.log('Lane.jsx/getFileUrl', lane);
	var url = lane.name;
	if (lane.upload == "dnd") {
	    console.log('Lane.jsx/getFileUrl:dnd', lane.filenameWithDate);
            url = 'http://weblicht.sfs.uni-tuebingen.de/clrs/storage/' + lane.filenameWithDate;
	} else {
	    console.log('Lane.jsx/getFileUrl:vlo', lane.filename);
	}

	var win = window.open(url, '_blank');
	win.focus();	
    }
}
