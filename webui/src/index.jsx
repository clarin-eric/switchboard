import React from 'react';
import ReactDOM from 'react-dom';
import {compose, applyMiddleware, createStore} from 'redux';
import {connect, Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {withRouter, BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import Modal from 'react-modal';

import {clientPath} from './constants';
import rootReducers from './actions/reducers';
import * as actions from './actions/actions';

import {NavBarContainer} from './containers/NavBarContainer';
import {FooterContainer} from './containers/FooterContainer';
import {MainContainer} from './containers/MainContainer';
import {MainInputContainer} from './containers/InputContainer';
import {AllToolsContainer} from './containers/AllToolsContainer';
import {AlertsContainer} from './containers/AlertsContainer';
import {AboutContainer, HelpContainer} from './containers/HelpContainers';


// polyfill for IE11
if (!window.origin) {
    const loc = window.location;
    window.origin = loc.protocol + "//" + loc.hostname + (loc.port ? ':' + loc.port: '');
}

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
                <NavBarContainer history={this.props.history} mode={this.props.mode}/>
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
const Frame = withRouter(connect(state=>({mode:state.mode}), ()=>({}))(FrameComponent));


class Application extends React.Component {
    constructor(props) {
        super(props);
        store.dispatch(actions.fetchApiInfo());
        store.dispatch(actions.fetchAllTools());
        store.dispatch(actions.fetchMediatypes());
        store.dispatch(actions.fetchLanguages());

        // // load a selection by default for testing
        // if (!window.SWITCHBOARD_DATA) {
        //     const form = Object.assign(document.createElement('form'),
        //         {method:'POST', enctype:'multipart/form-data'});
        //     const sel  = Object.assign(document.createElement('input'),
        //         {name:'selection', value:'Brunnen'});
        //     form.appendChild(sel);
        //     document.body.appendChild(form);
        //     form.submit();
        // }

        if (window.SWITCHBOARD_DATA) {
            const data = window.SWITCHBOARD_DATA;
            if (data.popup) {
                store.dispatch(actions.setMode('popup'));
            }
            if (data.errorMessage) {
                store.dispatch(actions.showError(data.errorMessage));
            } else if (data.fileInfoID) {
                store.dispatch(actions.fetchAsyncResourceState(data.fileInfoID));
            }
            delete window.SWITCHBOARD_DATA;
        }

        // // load a text file by default for testing
        // store.dispatch(require("./actions/actions").uploadLink({
        //     url:'https://b2drop.eudat.eu/s/ekDJNz7fWw69w5Y', origin:'b2drop'}))
        // store.dispatch(require("./actions/actions").uploadLink({
        //     url:'http://localhost:8000/testzip.zip', origin:'local'}))
    }

    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <Frame>
                        <Switch>
                            <Route exact path={clientPath.root} component={MainContainer} />
                            <Route exact path={clientPath.input} component={MainInputContainer} />
                            <Route exact path={clientPath.tools} component={AllToolsContainer} />
                            <Route exact path={clientPath.help} component={HelpContainer} />
                            <Route exact path={clientPath.about} component={AboutContainer} />
                            <Route component={NotFound} />
                        </Switch>
                    </Frame>
                    { store.getState().mode === 'popup' ?
                        false : // no footer in popup mode
                        <FooterContainer />
                    }
                </BrowserRouter>
            </Provider>
        );
    }
}

const NotFound = () => (
    <div>This page is not found!</div>
);

ReactDOM.render(<Application />, document.getElementById('reactapp'));
