import React from 'react';
import ReactDOM from 'react-dom';
import { compose, applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import {clientPath, clientHash} from './constants';
import rootReducers from './actions/reducers';
import {fetchApiInfo, fetchAllTools, fetchMediatypes, fetchLanguages} from './actions/actions';

import { NavBar } from './components/NavBar';
import { FooterContainer } from './containers/FooterContainer';
import { MainContainer } from './containers/MainContainer';
import { InputContainer } from './containers/InputContainer';
import { AllToolsContainer } from './containers/AllToolsContainer';
import { AboutContainer, HelpContainer } from './containers/HelpContainers';



// todo: show alerts on errors
// todo: use these
const errorMessages = {
    cannotUpload: `The switchboard was unable to upload your resource to a file
                    storage location (so that the resource becomes accessible
                    for the tools connected to the switchboard). Likely the
                    resource is too large or its MIME type is not allowed.
                    Please select a different resource with file size smaller
                    than {maxSize}. If failure persists, please contact
                    "switchboard@clarin.eu".`,
    badURL: `It seems that you have entered an incorrect or partial URL. Please
                    correct the URL and then try again.`,
    authenticationRequired: `The resource seems to be behind a Shibboleth
                    authentication wall. Please fetch the resource with your
                    authentication credentials by clicking on "Link to
                    Resource". Then use the standalone version of the LRS to
                    upload the resource.`,
    cannotGetResource: `The switchboard was unable to fetch the URL (404 or
                    similar). Please attempt to fetch the resource yourself by
                    pasting its link into a new browser tab. If successul, save
                    the file to your computer, and then upload the resource via
                    drag & drop into the switchboard's left-most drop area.`,
    analysisFailed: `The Switchboard was unable to identify the language and/or
                    mimetype of the given resource. Please specify the
                    information manually.`,
    noMatchingTools: `The Switchboard has currently no applicable tool than can
                    process the given resource (given its mediatype and
                    language). Please try again with another resource.`,
}


// todo: resolve DOIs and handles
// todo: test with:
//      -  bad data url
//      -  big file url
//      -  unsupported mimetype url
//      -  fake java exception
// todo: make sure we keep old urls
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


const Frame = (props) => (
    <div id="bodycontainer">
        <NavBar/>
        <div className="container">
            <div className="row">
                <div className="col-md-12">
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
        store.dispatch(fetchMediatypes());
        store.dispatch(fetchLanguages());

        // todo: remove this
        // var blob = new Blob(["this is a text"], {type: "text/plain"});
        // blob.name = "submitted_text.txt";
        // const {uploadFile} =  require('./actions/actions');
        // store.dispatch(uploadFile(blob));

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
