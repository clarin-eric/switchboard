import React from 'react';
import ReactDOM from 'react-dom';
import {compose, applyMiddleware, createStore} from 'redux';
import {connect, Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {withRouter, BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import Modal from 'react-modal';

import {clientPath} from './constants';
import rootReducers from './actions/reducers';
import {fetchApiInfo, fetchAllTools, fetchMediatypes, fetchLanguages} from './actions/actions';

import {NavBar} from './components/NavBar';
import {FooterContainer} from './containers/FooterContainer';
import {MainContainer} from './containers/MainContainer';
import {InputContainer} from './containers/InputContainer';
import {AllToolsContainer} from './containers/AllToolsContainer';
import {AlertsContainer} from './containers/AlertsContainer';
import {AboutContainer, HelpContainer} from './containers/HelpContainers';


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


class FrameComponent extends React.Component {
    constructor(props) {
        super(props);
        this.props.history.listen((location, action) => {
            _paq.push(['setCustomUrl', window.location.href]);
            _paq.push(['trackPageView']);
        });
    }

    render() {
        return (
            <div id="bodycontainer">
                <NavBar history={this.props.history}/>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            {this.props.children}
                        </div>
                    </div>
                </div>
                <AlertsContainer/>
            </div>
        );
    }
}
const Frame = withRouter(connect(state=>({}), ()=>({}))(FrameComponent));


class Application extends React.Component {
    constructor(props) {
        super(props);
        store.dispatch(fetchApiInfo());
        store.dispatch(fetchAllTools());
        store.dispatch(fetchMediatypes());
        store.dispatch(fetchLanguages());
    }

    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
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
                </BrowserRouter>
            </Provider>
        );
    }
}

const NotFound = () => (
    <div>This page is not found!</div>
);

ReactDOM.render(<Application />, document.getElementById('reactapp'));
