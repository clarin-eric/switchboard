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

function buildResourceTree(resources) {
    resources = SI.asMutable(resources);
    resources = resources.map(r => SI.asMutable(r));
    resources.forEach(r => r.indent = 0);
    resources.forEach(r => r.isSource = false);

    const resmap = {};
    resources.forEach(r => resmap[r.id] = r);

    let loop = true;
    while (loop) {
        loop = false;
        resources.forEach(r => {
            if (r.sourceID) {
                const parent = resmap[r.sourceID];
                if (parent && !parent.isSource) {
                    parent.isSource = true;
                }
                if (parent && parent.indent + 1 != r.indent ) {
                    loop = true;
                    r.indent = parent.indent + 1;
                }
            }
        });
    }
    return resources;
}

function resourceList(state = SI([]), action) {
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
            ret = buildResourceTree(ret);
            return SI(ret);
        }

        case actionType.RESOURCE_UPDATE: {
            let ret = state;
            const index = state.findIndex(r => r.id === action.data.id);
            if (index >= 0) {
                ret = ret.set(index, SI.merge(ret[index], action.data));
            } else {
                // add subresource at correct position
                let idx = ret.length;
                if (action.data.sourceID) {
                    let i = ret.findIndex(r => r.id === action.data.sourceID);
                    if (i >= 0) {
                        i++;
                        while (i < ret.length && ret[i].sourceID) {
                            i ++;
                        }
                        idx = i;
                    }
                }
                const mutable = SI.asMutable(ret);
                mutable.splice(idx, 0, action.data);
                ret = SI(mutable);
            }
            ret = buildResourceTree(ret);
            return SI(ret);
        }

        case actionType.RESOURCE_REMOVE: {
            let ret = state.filter(r => !action.data.has(r.id));
            ret = buildResourceTree(ret);
            return SI(ret);
        }
    }
    return state;
}

function matchingTools(state = SI({}), action) {
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
