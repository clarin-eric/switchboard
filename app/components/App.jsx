// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: App.jsx
// Time-stamp: <2018-09-20 20:36:27 (zinn)>
// -------------------------------------------

import AltContainer from 'alt-container';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// components
import Resources from './Resources.jsx';            // render all the resources
import TaskOrientedView from './TaskOrientedView';  // component to render the task-oriented view
import DropArea from './DropArea.jsx';              // drop & drag area for resources
import Toggle   from 'react-toggle';                // toggle button for enables/disabling web services
import UserHelp from './UserHelp.jsx';              // component displaying user help
import DevHelp from './DevHelp.jsx';                // component displaying help targeted at developers
import AboutHelp from './AboutHelp.jsx';            // displaying admin. information about the switchboard
import AlertURLFetchError from './AlertURLFetchError.jsx';
import ShowAllTools from './ShowAllTools.jsx';      // allow external requests to show all available tools

// actions
import ResourceActions from '../actions/ResourceActions';   // actions associated with resources: CRUD, attach/detach

// stores
import ResourceStore from '../stores/ResourceStore';        // storing resources (state)

// Piwik support
import PiwikReactRouter from 'piwik-react-router';

// routing 
import { HashRouter, Route, Switch } from 'react-router-dom';
import { hashHistory } from 'react-router';

// access to matcher
import Matcher from '../back-end/Matcher';

import {lrsVersion, emailContactCommand} from './../back-end/util';

// logo images for task-oriented view 
require('./../images/clarin-logo-wide.png');
require('./../images/gateCloud.png');
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
require('./../images/d4science.png');

require('./../images/YourLogoComesHere.png');
require('./../images/metadataListing1.png');
require('./../images/metadataListing2.png');

export default class App extends React.Component {

    constructor(props) {
	super(props);

	this.refresh = this.refresh.bind(this);
	this.showAllTools = this.showAllTools.bind(this);
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

	const p = window.performance;
	if (p) {
	    if (p.navigation.type == 1) {
		console.info( "This page is reloaded, clearing DropZone", p.navigation.type);
		this.clearDropzone();		
	    } else {
		console.info( "This page is not reloaded", p.navigation.type);
	    }
	}
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

    showAllTools() {
        // clear resource (so that tools don't show URL)
        this.clearDropzone();
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

	window.APP_CONTEXT_PATH = (function() {

            const links = Array.prototype.slice.call(
                document.getElementsByTagName('link'), 0);
            const favicon = links.find(e => e.rel == "shortcut icon");
            if (!favicon) return "";
            let href = favicon.href;
            if (href.startsWith(window.origin)) {
                href = href.substr(window.origin.length);
            }
            const components = href.split("/");
            if (components.length >= 3) {
                return "/"+components[1];
            }
            return "";
         })();
	
	console.log('App/render', window);
	var style = {
	    display: 'none'
	};

	return (
<div>
  <header id="header" role="banner">
    <link rel="shortcut icon" type="image/x-icon" href="./../images/favicon-cog.ico" />
    <div className="navbar-static-top  navbar-default navbar" role="navigation">
      <div className="container">
        <div className="navbar-header">
          <a className="navbar-brand" href="./" id="idce">
            <span><i className="fa fa-cog fa-1x" aria-hidden="true"></i> Language Resource Switchboard</span>
          </a>
        </div>
	
        <div className="collapse navbar-collapse" role="navigation" id="id1">
          <ul className="nav navbar-nav" id="idcf">
            <li>
	      <UserHelp className="header-link" />		 
            </li>
	    <li>
	      <button className="clearDropzone" onClick={this.clearDropzone}>Clear Dropzone</button>
	    </li>				
	    <li>
	      <button id="showAllToolsButton" className="alltools" onClick={this.showAllTools}>Show All Tools</button>
	    </li>
	    <li><p />
	      <Toggle
	        defaultChecked={false}
		onChange={this.handleWebServicesChange} />
	    </li>
          </ul>
	  <div className="col-sm-3 text-right">
            <a href="http://www.clarin.eu/">
	      <img src="clarin-logo-wide.png" width="119px" height="46px" background-position-x="15px" background-position-y="2px" />
	    </a>
	  </div>
        </div>
      </div>
    </div>
  </header>

  <div id='dragAndDropArea'></div>
  <HashRouter>
    <Switch>
      <Route exact path="/"
	    render={(props) => <DropArea clearDropzoneFun={this.clearDropzone} caller="standalone" {...props} /> } />
	<Route exact path="/vlo/:fileURL/:fileMimetype/:fileLanguage"
	       render={(props) => <DropArea clearDropzoneFun={this.clearDropzone} caller="VLO" {...props} /> } />
	  <Route exact path="/vlo/:fileURL/:fileMimetype"
		 render={(props) => <DropArea clearDropzoneFun={this.clearDropzone} caller="VLO" {...props} /> } />	    
	    <Route path="/vcr/:fileURL"
		   render={(props) => <DropArea clearDropzoneFun={this.clearDropzone} caller="VCR" {...props} /> } />
	      <Route path="/fcs/:fileURL"
   		     render={(props) => <DropArea clearDropzoneFun={this.clearDropzone} caller="FCS" {...props} /> } />	    
		<Route path="/b2drop/:fileURL"
	               render={(props) => <DropArea clearDropzoneFun={this.clearDropzone} caller="B2DROP" {...props} /> } />
		  <Route path="/d4science/:fileURL"
			 render={(props) => <DropArea clearDropzoneFun={this.clearDropzone} caller="D4SCIENCE" {...props} /> } />		
		    <Route path="/vto/"
			   render={(props) => <ShowAllTools showAllToolsFun={this.showAllTools} caller="CLARIN" {...props} /> } />
		      <Route path="*" component={AlertURLFetchError} />
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

  <footer id="footer">
    <div className="container">
      <div className="row">
        <div className="col-sm-6 col-sm-push-3 col-xs-12">
          <div className="text-center">
	    <div>
  	      <DevHelp className="header-link" />
	    </div>
            <span className="footer-fineprint">
              Service provided by <a href="https://www.clarin.eu">CLARIN</a>
            </span>
          </div>
        </div>
        <div className="col-sm-3 col-sm-pull-6 col-xs-12">
    	  <AboutHelp className="header-link" />
          <div className="version-info text-center-xs">
            {lrsVersion}
          </div>
        </div>
        <div className="col-sm-3 text-right">
	  <a href={ emailContactCommand }>Contact</a>
	  <div>
	    <a href="https://support.clarin-d.de/mail/?lang=de&QueueID=19&ResponsibleID=15&OwnerID=15" target="_blank">
	      <span>
		<i class="fa fa-info fa-2x" aria-hidden="true"></i>Help Desk
	      </span>
	    </a>
	  </div>
        </div>
      </div>
    </div>
  </footer>
</div>
);
}}
