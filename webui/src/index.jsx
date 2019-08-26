import React from 'react';
import ReactDOM from 'react-dom';
import { compose, applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import rootReducers from './actions/reducers';
import {fetchApiInfo, fetchAllTools} from './actions/actions';

import { NavBar } from './components/NavBar';
import { FooterContainer } from './containers/FooterContainer';
import { MainContainer } from './containers/MainContainer';
import { InputContainer } from './containers/InputContainer';
import { AllToolsContainer } from './containers/ToolListContainer';
import { AboutContainer, HelpContainer, FAQContainer, ForDevelopersContainer } from './containers/HelpContainers';

// todo: make sure we keep old urls
// todo: enable piwik


function middleware() {
    if (process.env.NODE_ENV === 'production') {
        return applyMiddleware(thunk);
    }
    const rde = window.__REDUX_DEVTOOLS_EXTENSION__;
    const devTools = (rde && rde()) || (f => f);
    return compose(applyMiddleware(thunk), devTools);
    // const {logger} = require ('redux-logger');
    // return compose(applyMiddleware(thunk, logger), devTools);
}
const store = createStore(rootReducers, middleware());


const Frame = (props) => (
    <div id="bodycontainer">
        <NavBar/>
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-1" />
                <div className="col-md-10">
                    {props.children}
                </div>
            </div>
        </div>
    </div>
);

class Application extends React.Component {
    constructor(props) {
        super(props);
        store.dispatch(fetchApiInfo());
        store.dispatch(fetchAllTools());

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
                            <Route exact path={window.APP_CONTEXT_PATH+'/'} component={MainContainer} />
                            <Route exact path={window.APP_CONTEXT_PATH+'/input'} component={InputContainer} />
                            <Route exact path={window.APP_CONTEXT_PATH+'/tools'} component={AllToolsContainer} />
                            <Route exact path={window.APP_CONTEXT_PATH+'/help'} component={HelpContainer} />
                            <Route exact path={window.APP_CONTEXT_PATH+'/help/about'} component={AboutContainer} />
                            <Route exact path={window.APP_CONTEXT_PATH+'/help/faq'} component={FAQContainer} />
                            <Route exact path={window.APP_CONTEXT_PATH+'/help/developers'} component={ForDevelopersContainer} />
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
