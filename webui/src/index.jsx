import React from 'react';
import ReactDOM from 'react-dom';
import { compose, applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
// todo: import PiwikReactRouter from 'piwik-react-router';

import rootReducers from './actions/reducers';
import { fetchApiInfo } from './actions/actions';

// todo: remove these
// import { BrowseJobs } from './containers/BrowseJobs';
// import { Job } from './containers/Job';
// import { CreateJob } from  './containers/CreateJob';
import { NavBar } from './components/NavBar';
import { FooterContainer } from './containers/FooterContainer';
import { HomeContainer } from './containers/HomeContainer';


function middleware() {
    if (process.env.NODE_ENV === 'production') {
        return applyMiddleware(thunk);
    }
    const {logger} = require ('redux-logger');
    const rde = window.__REDUX_DEVTOOLS_EXTENSION__;
    const devTools = (rde && rde()) || (f => f);
    return compose(applyMiddleware(thunk, logger), devTools);
}
const store = createStore(rootReducers, middleware());


class App extends React.Component {
    constructor(props) {
        super(props);
        store.dispatch(fetchApiInfo());
    }

    render() {
        // todo: remove these
        // <Route exact path='/jobs' component={BrowseJobs} />
        // <Route exact path='/jobs/new' component={CreateJob} />
        // <Route exact path='/jobs/:id' component={Job} />
        return (
            <Provider store={store}>
                <Router>
                    <div id="bodycontainer">
                        <NavBar/>
                        <Switch>
                            <Route exact path='/' component={HomeContainer} />
                            <Route component={NotFound} />
                        </Switch>
                    </div>
                    <FooterContainer />
                </Router>
            </Provider>
        );
    }
}

const NotFound = () => (
    <div>This page is not found!</div>
);

ReactDOM.render(<App />, document.getElementById('reactapp'));
