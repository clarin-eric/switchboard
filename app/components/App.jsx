// -- C. Zinn, claus.zinn@uni-tuebingen.de
// -- CLARIN-PLUS, Language Resources Switchboard
// -- Spring 2016

import AltContainer from 'alt-container';
import React from 'react';
import Lanes from './Lanes.jsx';                    // render all the lanes (lang resources)
import Tools from './Tools.jsx';                    // render all the tools
import Tasks from './Tasks.jsx';                    // task-oriented view
import LaneActions from '../actions/LaneActions';   // actions associated with lanes: CRUD, attach/detach
import LaneStore from '../stores/LaneStore';        // storing lanes (state)
import ToolStore from '../stores/ToolStore';        // storing tools (state)
import DropArea from './DropArea.jsx';              // drop & drag area for resources
import UrlArea from './UrlArea.jsx';                // all resource information given in parameters

// routing between DropArea and UrlArea
import { Router, Route, hashHistory } from 'react-router'

require('./../images/switchboard.png');
require('./../images/weblicht.jpg');
require('./../images/CLARIN-Logo16-c.jpg');
require('./../images/YourLogoComesHere.png');
require('./../html/about.html');

export default class App extends React.Component {
    render() {
	return (
	    <div>
	      <section className="page-header">
		<img className="alignLeft"  src="switchboard.png" width="20%" height="20%" />
		<img className="alignRight" src="CLARIN-Logo16-c.jpg" width="11%" height="11%" />
	        <h1 className="project-name">CLARIN Language Resource Switchboard</h1>
	        <h2 className="project-tagline">Find the appropriate tool for your resource.
                    <a className="whiteLink" href="about.html"> [ About ]</a>
		</h2>
   	      </section>
	      
	      <div id='dragAndDropArea'></div>
	      
	      <Router history={hashHistory}>	      
		<Route path="/" component={DropArea}/>
      		<Route path="/vlo/:fileURL/:fileSize/:fileMimetype/:fileLanguage" component={UrlArea}/>
              </Router>		
	      
   	      <AltContainer
                   stores={[LaneStore, ToolStore]}
                   inject={{
		       lanes: () => LaneStore.getState().lanes || [],
		       tools: () => ToolStore.getState().applicableTools || [],
		       tasks: () => ToolStore.getState().tasks || []		
		   }}
	       >
	       <Lanes />
	       <p />
   	       <hr />
  	       <p />
	       <h2>Task-Oriented View</h2>
               <Tasks />
	      </AltContainer>
	      <hr />
	      <footer className="page-footer" >
		<h4>Credits</h4>
		<p><a href="http://www.clarin.eu/node/4213">CLARIN-PLUS </a>receives funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement no. 676529. Your use of the CLARIN ERIC site is subject to the CC-BY and our terms of use.</p>
		<p>Contact: <a href="mailto:claus.zinn@uni-tuebingen.de?subject=CLARIN-PLUS LRS">Claus Zinn</a>. </p>
	      </footer>
	    </div>
	    );
    }
}
