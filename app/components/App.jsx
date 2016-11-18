// -- C. Zinn, claus.zinn@uni-tuebingen.de
// -- CLARIN-PLUS, Language Resources Switchboard
// -- Spring 2016

import AltContainer from 'alt-container';
import React from 'react';
import Lanes from './Lanes.jsx';                    // render all the lanes (lang resources)
import Tasks from './Tasks.jsx';                    // task-oriented view for all tools
import LaneActions from '../actions/LaneActions';   // actions associated with lanes: CRUD, attach/detach
import ToolActions from '../actions/ToolActions';   // access to findTools action
import NoteActions from '../actions/NoteActions';   // access to notes
import LaneStore from '../stores/LaneStore';        // storing lanes (state)
import ToolStore from '../stores/ToolStore';        // storing tools (state)
import DropArea from './DropArea.jsx';              // drop & drag area for resources
import UrlArea  from './UrlArea.jsx';               // all resource information given in parameters
import Toggle   from 'react-toggle';                // toggle button for enables/disabling web services
import UserHelp from './UserHelp.jsx';
import DevHelp from './DevHelp.jsx';
import AboutHelp from './AboutHelp.jsx';

// routing between DropArea and UrlArea
import { Router, Route, hashHistory } from 'react-router'

require('./../images/clarin-logo-wide.png');
require('./../images/switchboard.png');
require('./../images/weblicht.jpg');
require('./../images/voyant-tools.jpg');
require('./../images/frog.jpg');
require('./../images/colibriCore.jpg');
require('./../images/valkuil.jpg');
require('./../images/button_helpdesk_forhelp.png');
require('./../images/lindat.jpg');
require('./../images/foliastats.jpg');
require('./../images/mary.jpg');
require('./../images/tscan.jpg');
require('./../images/oersetter.jpg');
require('./../images/alpino.jpg');
require('./../images/fowlt.jpg');
require('./../images/clarindk.jpg');
require('./../images/CLARIN-Logo16-c.jpg');
require('./../images/YourLogoComesHere.png');
require('./../images/metadataListing1.png');
require('./../images/metadataListing2.png');

export default class App extends React.Component {

    constructor(props) {
	super(props)
	this.showTools = this.showTools.bind(this)
        this.clearDropzone = this.clearDropzone.bind(this)
        this.handleWebServicesChange = this.handleChange.bind(this, 'includeWebServices')

	this.state = {
	    includeWebServices: false
	};
    }

    handleChange (key, event) {
	this.setState({ [key]: event.target.checked }, function () {
	    console.log('now, the state has changed...:', this.state.includeWebServices);
	});
	if (event.target.checked === true) {
	    document.getElementById("showAllToolsButton").innerHTML = 'Show All Tools and Web Services';
	} else {
	    document.getElementById("showAllToolsButton").innerHTML = 'Show All Tools';	    
	}
    }

    showTools() {
	ToolActions.allTools( this.state.includeWebServices );	
    }

    clearDropzone() {
	ToolActions.reset();
	LaneActions.reset();
	NoteActions.reset();
    }

    popup_CLARIN_HELPDESK(url) {
	fenster = window.open(url, "CLARINHelpDesk", "width=370,height=570,resizable=yes");
	fenster.focus();
	return false;
    }
    
    render() {
	return (
<div>
  <header id="header" role="banner">
    <div className="navbar-static-top  navbar-default navbar" role="navigation">
      <div className="container">
        <div className="navbar-header">
          <a className="navbar-brand" href="./" id="idce">
            <span><i className="fa fa-cog fa-spin fa-1x fa-fw" aria-hidden="true"></i> Language Resource Switchboard</span>
          </a>
        </div>
	
        <div className="collapse navbar-collapse" role="navigation" id="id1">
          <ul className="nav navbar-nav" id="idcf">
            <li>
	      <UserHelp className="header-link" />		 
            </li>
	    <li>
	      <DevHelp className="header-link" />
	    </li>
	    <li>
	      <AboutHelp className="header-link" />
	    </li>	       	    
	    <li>
	      <button className="clearDropzone" onClick={this.clearDropzone}>Clear Dropzone</button>
	    </li>				
	    <li>
	      <button id="showAllToolsButton" className="alltools" onClick={this.showTools}>Show All Tools</button>
	    </li>
	    <li><p />
	      <Toggle
	         defaultChecked={false}
		 onChange={this.handleWebServicesChange} />
	    </li>
          </ul>
	  <ul className="nav navbar-nav navbar-right" id="id723">
            <li>
              <a href="http://www.clarin.eu/" className="clarin-logo hidden-xs">
		<span>CLARIN</span>
	      </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
  <div id='dragAndDropArea'></div>
  
  <Router history={hashHistory}>	      
    <Route path="/" component={DropArea}/>
    <Route path="/vlo/:fileURL/:fileMimetype/:fileLanguage" caller="VLO" component={UrlArea}/>
    <Route path="/vlo/:fileURL/:fileMimetype"               caller="VLO" component={UrlArea}/>		
    <Route path="/vlo/:tokenId" caller="VLO"                component={UrlArea}/>
    <Route path="/vcr/:fileURL" caller="VCR"                component={UrlArea}/>
    <Route path="/fcs/:fileURL" caller="FCS"                component={UrlArea}/>		
  </Router>
  
  <p />
  <hr />
  <p />
  
  <AltContainer
     stores={[LaneStore]}
                   inject={{
		       lanes: () => LaneStore.getState().lanes || []
		   }} >
    <Lanes  />
  </AltContainer>
  
  <h2>Task-Oriented Tool View </h2>
  
  <AltContainer
     stores={[ToolStore]}
                   inject={{
		       toolsPerTasks: () => ToolStore.getState().toolsPerTasks || [],
		       lane: () => LaneStore.getState().lanes[0] || []
		   }} >
    <Tasks />
  </AltContainer>
  
  <hr />
</div>
);
}}
