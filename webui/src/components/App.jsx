// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
//
// File: App.jsx
// Time-stamp: <2019-04-29 11:32:38 (zinn)>
// -------------------------------------------

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// components
import Resource from './Resource.jsx';              // render the resource
import TaskOrientedView from './TaskOrientedView';  // component to render the task-oriented view
import DropArea from './DropArea.jsx';              // drop & drag area for the resource
import UserHelp from './UserHelp.jsx';              // component displaying user help
import UserFAQ from './UserFAQ.jsx';                // component displaying user faq
import DevHelp from './DevHelp.jsx';                // component displaying help targeted at developers
import AboutHelp from './AboutHelp.jsx';            // displaying admin. information about the switchboard
import AlertURLFetchError from './AlertURLFetchError.jsx';

// Piwik support
import PiwikReactRouter from 'piwik-react-router';

// routing
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

// access to matcher
import MatcherRemote from '../back-end/MatcherRemote';

import { nextcloud_user, nextcloud_pass, lrsVersion, emailContactCommand } from './../back-end/util';

// logo images for task-oriented view
require('./../images/clarin-logo-wide.png');
require('./../images/gateCloud.png');
require('./../images/weblicht.jpg');
require('./../images/voyant-tools.jpg');
require('./../images/frog.jpg');
require('./../images/colibriCore.jpg');
require('./../images/valkuil.jpg');
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

require('./../images/file-solid.png');
require('./../images/location-arrow-solid.png');
require('./../images/keyboard-solid.png');

require('./../images/dropResources.png');

class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.close = this.close.bind(this);
        this.toggle = this.toggle.bind(this);
        this.state = {show: false};
    }

    close(e) {
        this.setState({show: false});
    }

    toggle(e) {
        this.setState(prev => ({show: !prev.show}));
    }

    render() {
        const navCollapseClass = this.state.show ? "collapse navbar-collapse text-right show" : "collapse navbar-collapse";
        return (
            <nav className="navbar navbar-default navbar-expand-lg fixed-top navbar-light bg-light">
                <a className="navbar-brand" href='/'>
                  <span><i className="fa fa-cog fa-1x" aria-hidden="true"></i> Resource Switchboard</span>
                </a>

                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation"
                        onClick={this.toggle}>
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div id="navbarSupportedContent" className={navCollapseClass}>
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <UserHelp className="btn header-link"/>
                        </li>
                        <li className="nav-item" onClick={this.close}>
                            <button id="showAllToolsButton" className="allTools" onClick={this.props.showAllTools}>Tool Inventory</button>
                        </li>
                    </ul>
                <div className="pull-right">
                  <a href="http://www.clarin.eu/">
                    <img src="clarin-logo-wide.png" width="119px" height="46px" />
                  </a>
                </div>
                </div>
            </nav>
        );
    }
}


export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.refresh = this.refresh.bind(this);
        this.showAllTools = this.showAllTools.bind(this);
        this.clearDropzone = this.clearDropzone.bind(this);

        this.handleToolsChange     = this.handleToolsChange.bind(this);
        this.handleResourcesChange = this.handleResourcesChange.bind(this);

        this.state = {
            tools     : [],
            resource  : undefined
        };

        this.piwik = PiwikReactRouter({
            url : 'https://stats.clarin.eu',
            siteId      : 21,
            enableLinkTracking: true
        });

    }

    handleToolsChange( tools ) {
        this.setState( { tools : tools } );
    }

    handleResourcesChange( resource ) {
        console.log('App/handleResourceChange', resource);
        this.setState( { resource : resource } );
    }

    refresh() {
        this.forceUpdate();
    }

    componentDidMount() {

        this.piwik.push(["setDomains",
                         ["*.weblicht.sfs.uni-tuebingen.de/clrs",
                          "*.weblicht.sfs.uni-tuebingen.de/clrs-dev",
                          "switchboard.clarin.eu"]]);

        this.piwik.push(['trackPageView']);

        const p = window.performance;
        if (p) {
            if (p.navigation.type == 1) {
                console.info( "This page is reloaded, clearing DropZone", p.navigation.type);
                this.clearDropzone();
            } else {
                console.info( "This page is not reloaded", p.navigation.type);
            }
        }

        //      this.refresh();
    }

    showAllTools() {

        // clear history
        history.pushState({}, "", "#");

        // clear resource (so that tools don't show URL)
        this.clearDropzone();
        const matcher = new MatcherRemote( true );
        const toolsPromise = matcher.getAllTools();
        const that = this;

        _paq.push(["trackEvent", 'showAllTools', null, null]);
        toolsPromise.then(
            function(resolve) {
                that.setState( {tools: resolve} );
            },
            function(reject) {
                console.log('App.jsx/showAllTools failed', reject);
            });
    }

    clearDropzone() {
        this.setState( { tools     : [],
                         resource  : undefined} );
    }

    render() {
        var style = {
            display: 'none'
        };

        let resource = this.state.resource;
        console.log('App/render', window.APP_CONTEXT_PATH, this.state, resource);

        return (
<div>
  <Navigation showAllTools={this.showAllTools}/>

  <div id='dragAndDropArea'></div>
  <Router history={history}>
    <Switch>
      <Route exact path="/"
            render={(props) => <DropArea onToolsChange={this.handleToolsChange}
                    onResourcesChange={this.handleResourcesChange} caller="standalone" {...props} /> } />
      <Route exact path="/vlo/:fileURL/:fileMimetype/:fileLanguage"
            render={(props) => <DropArea onToolsChange={this.handleToolsChange}
                    onResourcesChange={this.handleResourcesChange} caller="VLO"        {...props} /> } />
      <Route exact path="/vlo/:fileURL/:fileMimetype"
            render={(props) => <DropArea onToolsChange={this.handleToolsChange}
                    onResourcesChange={this.handleResourcesChange} caller="VLO"        {...props} /> } />
      <Route path="/vcr/:fileURL"
            render={(props) => <DropArea onToolsChange={this.handleToolsChange}
                    onResourcesChange={this.handleResourcesChange} caller="VCR"        {...props} /> } />
      <Route path="/fcs/:fileURL"
            render={(props) => <DropArea onToolsChange={this.handleToolsChange}
                    onResourcesChange={this.handleResourcesChange} caller="FCS"        {...props} /> } />
      <Route path="/b2drop/:fileURL"
            render={(props) => <DropArea onToolsChange={this.handleToolsChange}
                    onResourcesChange={this.handleResourcesChange} caller="B2DROP"    {...props} /> } />
      <Route path="/b2share/:fileURL"
            render={(props) => <DropArea onToolsChange={this.handleToolsChange}
                    onResourcesChange={this.handleResourcesChange} caller="B2SHARE"   {...props} /> } />
      <Route path="/textgrid/:fileURL"
            render={(props) => <DropArea onToolsChange={this.handleToolsChange}
                    onResourcesChange={this.handleResourcesChange} caller="TEXTGRID"   {...props} /> } />
      <Route path="/d4science/:fileURL"
            render={(props) => <DropArea onToolsChange={this.handleToolsChange}
                    onResourcesChange={this.handleResourcesChange} caller="D4SCIENCE"  {...props} /> } />
      <Route path="*" component={AlertURLFetchError} />
    </Switch>
  </Router>

  <p />
  <hr />
  <p />

  <Resource className         = "resource"
            onToolsChange     = { this.handleToolsChange    }
            onResourcesChange = { this.handleResourcesChange }
            resource          = { this.state.resource || undefined }
        />

  <p />
  <hr />
  <p />

  <TaskOrientedView resource = { this.state.resource || undefined }
                      tools  = { this.state.tools    || [] }
                />
  <p />
  <hr />
  <p />

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
          <div className="text-center">
            <a href={ emailContactCommand }>Contact & Support</a>
            <div>
              <UserFAQ className="header-link" />
            </div>
          </div>
          </div>
      </div>
    </div>
  </footer>
</div>
);
}}
