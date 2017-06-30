import AltContainer from 'alt-container';
import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import LaneActions from '../actions/LaneActions';
import LaneStore from '../stores/LaneStore';
import Toggle   from 'react-toggle';

// access to matcher
import Matcher from '../libs/Matcher';


export default class Lane extends React.Component {
    constructor(props) {
	super(props);

	console.log('Lane/constructor', props);
	const lane = props.lane;
	console.log('Lane/constructor with lane', lane);	
	this.handleToolsPerTaskChange = props.passChangeToParent;
	
	this.showTools            = this.showTools.bind(this, lane);
	this.getFileUrl              = this.getFileUrl.bind(this, lane);
	this.handleWebServicesChange = this.handleChange.bind(this, 'includeWebServices')

	this.state = {
	    includeWebServices: false
	};

    }
    render() {
	const {lane, passChangeToParent, ...props} = this.props;
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
  	          <button id="showToolsButton" onClick={this.showTools}>Show Tools</button>
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
    
    showTools(lane) {

	let includeWebServices = this.state.includeWebServices;
	console.log('Lane/showTools invocation',
		    'webservices:', includeWebServices,
		    'resource:', lane);
	
	
	if (lane.language == null) {
	    alert('CLRS: Please identify the language of the resource!');
	    return;
	}

	if (lane.mimetype == null) {
	    alert('CLRS: Please identify the mimetype of the resource!');
	    return;
	}

	let matcher = new Matcher();
	let toolsPerTask = matcher.findApplicableTools( lane, includeWebServices );
	console.log('Lane/showTools applicable tools for', lane, toolsPerTask, this.handleToolsPerTaskChange, this);
	this.handleToolsPerTaskChange( toolsPerTask );
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
