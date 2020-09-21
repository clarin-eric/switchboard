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

function mode(state = null, action) {
    switch (action.type) {
        case actionType.MODE:
            return SI(action.mode);
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

function resourceList(state = SI([]), action) {
    switch (action.type) {
        case actionType.RESOURCE_UPDATE: {
            const index = state.findIndex(r => r.id === action.data.id);
            if (index >= 0) {
                const newstate = state.asMutable();
                newstate[index] = action.data;
                return SI(newstate);
            } else {
                const newstate = state.asMutable();
                newstate.push(action.data);
                return SI(newstate);
            }
        }
        case actionType.RESOURCE_REMOVE: {
            const index = state.findIndex(r => r.id === action.data.id);
            if (index >= 0) {
                const newstate = state.asMutable();
                newstate.splice(index, 1);
                return SI(newstate);
            }
        }
        default:
            return state;
    }
}

function matchingTools(state = SI({}), action) {
    switch (action.type) {
        case actionType.MATCHING_TOOLS_FETCH_START:
            return SI({tools: null});
        case actionType.MATCHING_TOOLS_FETCH_SUCCESS:
            return SI({tools: action.data});
        default:
            return state;
    }
}

function alerts(state = SI([]), action) {
    switch (action.type) {
        case actionType.ERROR:
            let alert = {
                message: action.message,
                url: action.url,
                resourceStatus: action.resourceStatus,
            };
            let mutable = state.asMutable();
            let idx = mutable.findIndex(x => x.message === action.message);
            if (idx >= 0) {
                mutable.splice(idx, 1);
            }
            mutable.push(alert);
            return SI(mutable);
        case actionType.CLEAR_ERRORS:
            return SI([]);
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    mode,
    apiinfo,
    mediatypes,
    languages,
    allTools,
    resourceList,
    matchingTools,
    alerts
});

export default rootReducer;
