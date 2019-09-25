import React from 'react';
import ReactDOM from 'react-dom';
import { compose, applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Modal from 'react-modal';

import {clientPath} from './constants';
import rootReducers from './actions/reducers';
import {fetchApiInfo, fetchAllTools, fetchMediatypes, fetchLanguages} from './actions/actions';

import { NavBar } from './components/NavBar';
import { FooterContainer } from './containers/FooterContainer';
import { MainContainer } from './containers/MainContainer';
import { InputContainer } from './containers/InputContainer';
import { AllToolsContainer } from './containers/AllToolsContainer';
import { AlertsContainer } from './containers/AlertsContainer';
import { AboutContainer, HelpContainer } from './containers/HelpContainers';


// todo: resolve DOIs and handles
// todo: update help
// todo: history with text states, resources
// todo: enable piwik


function middleware() {
    if (process.env.NODE_ENV === 'production') {
        return applyMiddleware(thunk);
    }
    const rde = window.__REDUX_DEVTOOLS_EXTENSION__;
    const devTools = (rde && rde()) || (f => f);
    return compose(applyMiddleware(thunk), devTools);
}
const store = createStore(rootReducers, middleware());

Modal.setAppElement("#reactapp");

const Frame = (props) => (
    <div id="bodycontainer">
        <NavBar location_href={window.location.href}/>
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    {props.children}
                </div>
            </div>
        </div>
        <AlertsContainer/>
    </div>
);

class Application extends React.Component {
    constructor(props) {
        super(props);
        store.dispatch(fetchApiInfo());
        store.dispatch(fetchAllTools());
        store.dispatch(fetchMediatypes());
        store.dispatch(fetchLanguages());

        // todo remove this
        // store.dispatch(require('./actions/actions').uploadLink('asdf'));

        // this.piwik = PiwikReactRouter({
        //     url : 'https://stats.clarin.eu',
        //     siteId      : 21,
        //     enableLinkTracking: true
        // });
    }

    componentDidMount() {
        // todo: enable piwik
        // const domains = [
        //     "*.weblicht.sfs.uni-tuebingen.de/switchboard-test",
        //     "switchboard.clarin-dev.eu",
        //     "beta-switchboard.clarin.eu",
        //     "switchboard.clarin.eu"
        // ];
        // this.piwik.push(["setDomains", domains]);
        // this.piwik.push(['trackPageView']);
    }

    render() {
        // todo: remove these
        // <Route exact path='/jobs/:id' component={Job} />
        return (
            <Provider store={store}>
                <Router>
                    <Frame>
                        <Switch>
                            <Route exact path={clientPath.root} component={MainContainer} />
                            <Route exact path={clientPath.input} component={InputContainer} />
                            <Route exact path={clientPath.tools} component={AllToolsContainer} />
                            <Route exact path={clientPath.help} component={HelpContainer} />
                            <Route exact path={clientPath.about} component={AboutContainer} />
                            <Route component={NotFound} />
                        </Switch>
                    </Frame>
                    <FooterContainer />
                </Router>
            </Provider>
        );
    }
}

const NotFound = () => (
    <div>This page is not found!</div>
);

ReactDOM.render(<Application />, document.getElementById('reactapp'));
