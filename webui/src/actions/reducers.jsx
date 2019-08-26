import SI from 'seamless-immutable';
import { combineReducers } from 'redux';
import { actionType } from '../constants';

function apiinfo(state = SI({}), action) {
    switch (action.type) {
        case actionType.APIINFO_FETCH_SUCCESS:
            return SI(action.data);
        default:
            return state;
    }
}

function mediatypes(state = SI([]), action) {
    switch (action.type) {
        case actionType.MEDIATYPES_FETCH_SUCCESS:
            return SI(action.data);
        default:
            return state;
    }
}

function languages(state = SI([]), action) {
    switch (action.type) {
        case actionType.LANGUAGES_FETCH_SUCCESS:
            return SI(action.data);
        default:
            return state;
    }
}

function allTools(state = SI([]), action) {
    switch (action.type) {
        case actionType.ALL_TOOLS_FETCH_SUCCESS:
            return SI(action.data);
        default:
            return state;
    }
}

function resource(state = SI({}), action) {
    switch (action.type) {
        case actionType.RESOURCE_INIT:
            return SI(action.data);
        case actionType.RESOURCE_UPDATE:
            return SI(action.data);
        default:
            return state;
    }
}

function matchingTools(state = SI([]), action) {
    switch (action.type) {
        case actionType.RESOURCE_INIT:
            return SI([]);
        case actionType.MATCHING_TOOLS_FETCH_SUCCESS:
            return SI(action.data);
        default:
            return state;
    }
}

function alerts(state = SI([]), action) {
    switch (action.type) {
        case actionType.ERROR:
            let mutable = state.asMutable();
            mutable.push(action.message);
            return SI(mutable);
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    apiinfo,
    mediatypes,
    languages,
    allTools,
    resource,
    matchingTools,
    alerts
});

export default rootReducer;
