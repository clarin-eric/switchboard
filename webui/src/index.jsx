import React from 'react';
import ReactDOM from 'react-dom';
import {configureStore} from '@reduxjs/toolkit';
import {connect, Provider} from 'react-redux';
import {BrowserRouter, Route, Routes} from 'react-router';
import Modal from 'react-modal';

import './style.scss';

import {clientPath} from './constants';
import rootReducers from './actions/reducers';
import * as actions from './actions/actions';
import {withRouter} from './reactHelpers';

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

const store = configureStore({
    reducer: rootReducers,
    middleware: getDefaultMiddleware => {
        const middleware = getDefaultMiddleware();

        return middleware;
    },
    devTools: process.env.NODE_ENV !== 'production'
});

Modal.setAppElement("#reactapp");


class FrameComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="bodycontainer">
                <NavBarContainer mode={this.props.mode}/>
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
                store.dispatch(actions.setPopupMode());
            }
            if (data.errorMessage) {
                store.dispatch(actions.showError(data.errorMessage));
            } else if (data.fileInfoID) {
                if (!Array.isArray(data.fileInfoID)) {
                    data.fileInfoID = [data.fileInfoID];
                }
                data.fileInfoID.forEach(id =>
                    store.dispatch(actions.fetchAsyncResourceState(id))
                );
            }
            delete window.SWITCHBOARD_DATA;
        } else {
            // load a text file by default for testing
            // store.dispatch(require("./actions/actions").uploadLink({
            //     url:'https://b2drop.eudat.eu/s/D6ACr5TomagTfoK', origin:'b2drop'}))
            // store.dispatch(require("./actions/actions").uploadLink({
            //     url:'https://b2drop.eudat.eu/s/ekDJNz7fWw69w5Y', origin:'b2drop'}))
            // store.dispatch(require("./actions/actions").uploadLink({
            //     url:'http://localhost:8000/testzip.zip', origin:'local'}))
        }
    }

    render() {
        return (
            <Provider store={store}>
                    <Frame>
                        <Routes>
                            <Route path={clientPath.root} element={<MainContainer />} />
                            <Route path={clientPath.input} element={<MainInputContainer />} />
                            <Route path={clientPath.tools} element={<AllToolsContainer />} />
                            <Route path={clientPath.help} element={<HelpContainer />} />
                            <Route path={clientPath.about} element={<AboutContainer />} />
                            <Route component={<NotFound />} />
                        </Routes>
                    </Frame>
                    { store.getState().mode === 'popup' ?
                        false : // no footer in popup mode
                        <FooterContainer />
                    }
            </Provider>
        );
    }
}

const NotFound = () => (
    <div>This page is not found!</div>
);

ReactDOM.render(<BrowserRouter><Application /></BrowserRouter>, document.getElementById('reactapp'));
