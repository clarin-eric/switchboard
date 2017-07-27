// -- C. Zinn, claus.zinn@uni-tuebingen.de
// -- CLARIN-PLUS, Language Resources Switchboard
// -- Spring 2016

import AltContainer from 'alt-container';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// components
import Resources from './Resources.jsx';            // render all the resources
import TaskOrientedView from './TaskOrientedView';  // component to render the task-oriented view
import DropArea from './DropArea.jsx';              // drop & drag area for resources
import UrlArea  from './UrlArea.jsx';               // all resource information given in parameters
import Toggle   from 'react-toggle';                // toggle button for enables/disabling web services
import UserHelp from './UserHelp.jsx';              // component displaying user help
import DevHelp from './DevHelp.jsx';                // component displaying help targeted at developers
import AboutHelp from './AboutHelp.jsx';            // displaying admin. information about the switchboard
import AlertURLFetchError from './AlertURLFetchError.jsx';

// actions
import ResourceActions from '../actions/ResourceActions';   // actions associated with resources: CRUD, attach/detach

// stores
import ResourceStore from '../stores/ResourceStore';        // storing resources (state)

// Piwik support
import PiwikReactRouter from 'piwik-react-router';

// routing between DropArea and UrlArea
import { HashRouter, Route, Switch } from 'react-router-dom';
import { hashHistory } from 'react-router';

// access to matcher
import Matcher from '../back-end/Matcher';

// logo images for task-oriented view (CZ: should move to TaskOrientedView
require('./../images/clarin-logo-wide.png');
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
require('./../images/zil.png');
require('./../images/acdh.png');
require('./../images/clarin-pl.png');

require('./../images/YourLogoComesHere.png');
require('./../images/metadataListing1.png');
require('./../images/metadataListing2.png');

export default class App extends React.Component {

    constructor(props) {
	super(props);

	this.refresh = this.refresh.bind(this);
	this.showTools = this.showTools.bind(this);
        this.clearDropzone = this.clearDropzone.bind(this);
        this.handleWebServicesChange = this.handleChange.bind(this, 'includeWebServices');
	this.handleToolsPerTaskChange = this.handleToolsPerTaskChange.bind(this);

	this.state = {
	    includeWebServices: false,
	    toolsPerTask : {}
	};

	this.piwik = PiwikReactRouter({
	    url	: 'https://stats.clarin.eu',
	    siteId	: 21,
	    enableLinkTracking: true
        });
    }

    handleToolsPerTaskChange( toolsPerTask ) {
	this.setState( {toolsPerTask: toolsPerTask} );
    }
    
    refresh() {
	this.forceUpdate();
    }

    componentDidMount() {
	this.piwik.push(["setDomains", ["*.weblicht.sfs.uni-tuebingen.de/clrs","*.weblicht.sfs.uni-tuebingen.de/clrs"]]);
	this.piwik.push(['trackPageView']);

	// CZ: check whether following is nececessary for cache busting (localStorage)
	localStorage.removeItem("app");
	this.refresh();
    }
    
    handleChange (key, event) {
	this.setState({ [key]: event.target.checked }, function () {
	    //console.log('The app state has changed...:', this.state.includeWebServices);
	});
	if (event.target.checked === true) {
	    document.getElementById("showAllToolsButton").innerHTML = 'Show All Tools and Web Services';
	} else {
	    document.getElementById("showAllToolsButton").innerHTML = 'Show All Tools';	    
	}
    }

    showTools() {
	let matcher = new Matcher();
	let toolsPerTask = matcher.allTools( this.state.includeWebServices );
	this.setState( {toolsPerTask: toolsPerTask} );
    }

    clearDropzone() {
	localStorage.removeItem("app"); // CZ: check whether necessary for cache busting

	this.setState( {toolsPerTask: {} } );
	ResourceActions.reset();
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
  <HashRouter>
    <Switch>
      <Route exact path="/" component={DropArea} />
      <Route exact path="/vlo/:fileURL/:fileMimetype/:fileLanguage"
	     render={(props) => <UrlArea refreshFun={this.refresh} caller="VLO" {...props} /> } />
      <Route exact path="/vlo/:fileURL/:fileMimetype"
             render={(props) => <UrlArea refreshFun={this.refresh} caller="VLO" {...props} /> } />	    
      <Route path="/vcr/:fileURL"
            render={(props) => <UrlArea refreshFun={this.refresh} caller="VCR" {...props} /> } />
      <Route path="/fcs/:fileURL"
   	    render={(props) => <UrlArea refreshFun={this.refresh} caller="FCS" {...props} /> } />	    
      <Route path="/b2drop/:fileURL"
	    render={(props) => <UrlArea refreshFun={this.refresh} caller="B2DROP" {...props} /> } />    
      <Route path="*"       component={AlertURLFetchError} />
    </Switch>
  </HashRouter>
  
  <p />
  <hr />
  <p />
  
  <AltContainer
     stores={[ResourceStore]}
                   inject={{
		       resources: () => ResourceStore.getState().resources || []
		   }} >
    <Resources passChangeToParent = { this.handleToolsPerTaskChange } />
  </AltContainer>
  <TaskOrientedView resource = { ResourceStore.getState().resources[0] || [] }
            toolsPerTask = { this.state.toolsPerTask || {} }
		/>
  <hr />
</div>
);
}}
