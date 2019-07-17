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
import Request from 'superagent';

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
import MatcherRemote from './MatcherRemote';

import { image } from './util';

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
                  <span>Language Resource Switchboard</span>
                </a>

                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation"
                        onClick={this.toggle}>
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div id="navbarSupportedContent" className={navCollapseClass}>
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item" onClick={this.close}>
                            <button id="showAllToolsButton" className="allTools" onClick={this.props.showAllTools}>Tool Inventory</button>
                        </li>
                        <li className="nav-item">
                            <UserHelp className="btn header-link" contact={this.props.contact}/>
                        </li>
                        <li className="nav-item">
                            <UserFAQ className="btn header-link" contact={this.props.contact}/>
                        </li>
                        <li className="nav-item">
                            <DevHelp className="btn header-link" contact={this.props.contact}/>
                        </li>
                    </ul>
                <div className="pull-right">
                  <a href="http://www.clarin.eu/">
                    <img src={image('clarin-logo-wide.png')} width="119px" height="46px" />
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
            resource  : undefined,
            lrsVersion: undefined,
            maxAllowedDataSize: 1024, // will be overwritten on fetchApiInfo
            contact: "",
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

        Request
            .get(window.APP_CONTEXT_PATH + '/api/info')
            .set('Accept', 'application/json')
            .then((response) => {
              console.log("apiinfo", response);
              const info = response.body || {};
              this.setState({
                lrsVersion: info.version,
                contact: "mailto:"+info.contactEmail,
                maxAllowedDataSize: info.maxAllowedDataSize,
              })
            });
    }

    showAllTools() {

        // clear history
        history.pushState({}, "", "#");

        // clear resource (so that tools don't show URL)
        this.clearDropzone();
        const matcher = new MatcherRemote();
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
  <Navigation showAllTools={this.showAllTools} contact={this.state.contact}/>

  <div id='dragAndDropArea'></div>
  <Router history={history}>
    <Switch>
      <Route exact path="/"
            render={(props) => <DropArea onToolsChange={this.handleToolsChange}
                    onResourcesChange={this.handleResourcesChange}
                    maxSize={this.state.maxAllowedDataSize} caller="standalone" {...props} /> } />
      <Route exact path="/vlo/:fileURL/:fileMimetype/:fileLanguage"
            render={(props) => <DropArea onToolsChange={this.handleToolsChange}
                    onResourcesChange={this.handleResourcesChange}
                    maxSize={this.state.maxAllowedDataSize} caller="VLO"        {...props} /> } />
      <Route exact path="/vlo/:fileURL/:fileMimetype"
            render={(props) => <DropArea onToolsChange={this.handleToolsChange}
                    onResourcesChange={this.handleResourcesChange}
                    maxSize={this.state.maxAllowedDataSize} caller="VLO"        {...props} /> } />
      <Route path="/vcr/:fileURL"
            render={(props) => <DropArea onToolsChange={this.handleToolsChange}
                    onResourcesChange={this.handleResourcesChange}
                    maxSize={this.state.maxAllowedDataSize} caller="VCR"        {...props} /> } />
      <Route path="/fcs/:fileURL"
            render={(props) => <DropArea onToolsChange={this.handleToolsChange}
                    onResourcesChange={this.handleResourcesChange}
                    maxSize={this.state.maxAllowedDataSize} caller="FCS"        {...props} /> } />
      <Route path="/b2drop/:fileURL"
            render={(props) => <DropArea onToolsChange={this.handleToolsChange}
                    onResourcesChange={this.handleResourcesChange}
                    maxSize={this.state.maxAllowedDataSize} caller="B2DROP"    {...props} /> } />
      <Route path="/b2share/:fileURL"
            render={(props) => <DropArea onToolsChange={this.handleToolsChange}
                    onResourcesChange={this.handleResourcesChange}
                    maxSize={this.state.maxAllowedDataSize} caller="B2SHARE"   {...props} /> } />
      <Route path="/textgrid/:fileURL"
            render={(props) => <DropArea onToolsChange={this.handleToolsChange}
                    onResourcesChange={this.handleResourcesChange}
                    maxSize={this.state.maxAllowedDataSize} caller="TEXTGRID"   {...props} /> } />
      <Route path="/d4science/:fileURL"
            render={(props) => <DropArea onToolsChange={this.handleToolsChange}
                    onResourcesChange={this.handleResourcesChange}
                    maxSize={this.state.maxAllowedDataSize} caller="D4SCIENCE"  {...props} /> } />
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
        <div className="col-sm-2 col-xs-12  text-center">
          <AboutHelp className="header-link" contact={this.state.contact}/>
          <div className="version-info text-center-xs">
            v{this.state.lrsVersion}
          </div>
        </div>
        <div className="col-sm-8 col-xs-12">
          <div className="text-center">
            <span className="footer-fineprint">
              Service provided by <a href="https://www.clarin.eu">CLARIN</a>
            </span>
          </div>
        </div>
        <div className="col-sm-2 col-xs-12" style={{maxWidth: '15%'}}>
          <div className="text-center">
            <a href={ this.state.contact }>Contact</a>
          </div>
          </div>
      </div>
    </div>
  </footer>
</div>
);
}}
