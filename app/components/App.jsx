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
import DropArea from './DropArea.jsx';

require('./../images/switchboard.png');

export default class App extends React.Component {
    render() {
	return (
	    <div>
	      <section className="page-header">
	        <h1 className="project-name">CLARIN Language Resources Switchboard</h1>
	        <h2 className="project-tagline">Find the appropriate tool for your resource. </h2>
    	        <img src="switchboard.png" width="20%" height="20%" />
   	      </section>
	      <div id='dragAndDropArea'></div>	
	       <DropArea />
	    
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
	    
  	      <section className="main-content">
	        <footer className="site-footer">
    	          <span className="site-footer-owner">
	            <a href="http://clarin-d.net">CLARIN-D / CLARIN-PLUS LRS</a> is maintained by Claus Zinn.
   	          </span>
     	        </footer>
	      </section>
	    </div>
	);
    }
    addLane() {
	LaneActions.create({name: 'New lane'});
    }
}
