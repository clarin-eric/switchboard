import SI from 'seamless-immutable';
import { actionType } from '../constants';

function apiinfoReducer(state = SI({}), action) {
    switch (action.type) {
        case actionType.APIINFO_FETCH_SUCCESS:
            return SI(action.data);
        default:
            return state;
    }
}

function modeReducer(state = null, action) {
    switch (action.type) {
        case actionType.MODE:
            return SI(action.mode);
        default:
            return state;
    }
}

function mediatypesReducer(state = SI([]), action) {
    switch (action.type) {
        case actionType.MEDIATYPES_FETCH_SUCCESS:
            return SI(action.data);
        default:
            return state;
    }
}

function languagesReducer(state = SI([]), action) {
    switch (action.type) {
        case actionType.LANGUAGES_FETCH_SUCCESS:
            return SI(action.data);
        default:
            return state;
    }
}

function allToolsReducer(state = SI([]), action) {
    switch (action.type) {
        case actionType.ALL_TOOLS_FETCH_SUCCESS:
            return SI(action.data);
        default:
            return state;
    }
}

function reorderAndIndentReducer(resources) {
    resources = SI.asMutable(resources);
    resources = resources.map(r => SI.asMutable(r));

    const resmap = {};
    resources.forEach(r => {
        resmap[r.id] = r;
        r.indent = 0;
        r.isSource = false;
        r.dependants = [];
    });

    function parentResource(r) {
        const sourceID = r.originalResource ? r.originalResource.sourceID : r.sourceID;
        return sourceID ? resmap[sourceID] : null;
    }

    resources.forEach(r => {
        const parent = parentResource(r);
        if (parent) {
            parent.isSource = true;
            parent.dependants.push(r.id);
        }
    });

    const neworder = [];
    function recurse(id, indent) {
        const res = resmap[id];
        if (res) {
            res.indent = indent;
            neworder.push(res);
            res.dependants.forEach(id2 => recurse(id2, indent + 1));
        }
    }
    resources.forEach(r => {
        if (!parentResource(r)) {
            recurse(r.id, 0);
        }
    });
    return neworder;
}

function resourceListReducer(state = SI([]), action) {
    switch (action.type) {
        case actionType.RESOURCE_CLEAR_ALL: {
            return SI([]);
        }

        case actionType.RESOURCE_REMOVE_SOURCE: {
            let ret = state;
            for (let index = 0; index < ret.length; index++) {
                const r = ret[index];
                if (action.data.has(r.id)) {
                    ret = ret.set(index, SI.without(r, ['sourceID', 'sourceEventName']));
                }
            }
            return SI(reorderAndIndentReducer(ret));
        }

        case actionType.RESOURCE_UPDATE: {
            let ret = state;
            const newres = action.data;
            const index = state.findIndex(r => r.id === newres.id);
            if (index >= 0) {
                ret = ret.set(index, SI.merge(ret[index], newres));
            } else {
                ret = ret.set(ret.length, newres);
            }
            return SI(reorderAndIndentReducer(ret));
        }

        case actionType.RESOURCE_REMOVE: {
            let ret = state.filter(r => !action.data.has(r.id));
            return SI(reorderAndIndentReducer(ret));
        }
    }
    return state;
}

function matchingToolsReducer(state = SI({}), action) {
    switch (action.type) {
        case actionType.MATCHING_TOOLS_FETCH_START:
            return SI({tools: null});
        case actionType.MATCHING_TOOLS_FETCH_SUCCESS:
            return SI({tools: action.data});
        case actionType.SELECT_RESOURCE_MATCH:
            const newstate = state.asMutable({deep:true});
            newstate.tools.forEach(t => {
                if (t.name === action.data.toolName) {
                    t.invokeMatchIndex = action.data.matchIndex;
                }
            })
            return SI(newstate);
        default:
            return state;
    }
}

function alertsReducer(state = SI([]), action) {
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

const rootReducer = {
        mode: modeReducer,
        apiinfo: apiinfoReducer,
        mediatypes: mediatypesReducer,
        languages: languagesReducer,
        allTools: allToolsReducer,
        resourceList: resourceListReducer,
        matchingTools: matchingToolsReducer,
        alerts: alertsReducer
    };

export default rootReducer;
