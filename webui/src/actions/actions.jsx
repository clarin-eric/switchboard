import axios from 'axios';
import { apiPath, actionType, resourceMatchSettings } from '../constants';
import { addLanguageMapping, processLanguage, processMediatype } from './utils';

let lastResourceID = 0;

export function updateResource(resource) {
    return function (dispatch, getState) {
        dispatch({
            type: actionType.RESOURCE_UPDATE,
            data: resource,
        });
        dispatch(fetchMatchingTools());
    }
}

export function removeResource(resource) {
    return function (dispatch, getState) {
        dispatch({
            type: actionType.RESOURCE_REMOVE,
            data: resource,
        });
        dispatch(fetchMatchingTools());
    }
}

export function selectResourceMatch(toolName, matchIndex) {
    return function (dispatch, getState) {
        dispatch({
            type: actionType.SELECT_RESOURCE_MATCH,
            data: {toolName, matchIndex},
        });
    }
}

function uploadData(formData) {
    return function (dispatch, getState) {
        const newResource = {id: ++lastResourceID};
        dispatch(updateResource(newResource));
        axios
            .post(apiPath.storage, formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            })
            .then(updateResourceCallback(dispatch, newResource))
            .catch(resourceErrorCallback(dispatch, newResource));
    }
}

function updateResourceCallback(dispatch, resource) {
    return response => {
        const res = response.data;
        if (res.localLink && res.localLink.startsWith(apiPath.api)) {
            res.localLink = window.origin + res.localLink;
        }
        if (resource.id !== res.id) {
            dispatch(removeResource(resource));
        }
        dispatch(updateResource(Object.assign({}, resource, res)));
    };
}

function resourceErrorCallback(dispatch, resource) {
    return error => {
        dispatch(removeResource(resource));
        errHandler(dispatch)(error);
    };
}

export function uploadLink(params) {
    var formData = new FormData();
    for (const key in params) {
        formData.append(key, params[key]);
    }
    return uploadData(formData);
}

export function uploadFile(file) {
    var formData = new FormData();
    formData.append("file", file, file.name);
    return uploadData(formData);
}

export function fetchAsyncResourceState(id) {
    return function (dispatch, getState) {
        const newResource = {id};
        dispatch(updateResource(newResource));
        axios.get(apiPath.storageInfo(id))
            .then(updateResourceCallback(dispatch, newResource))
            .catch(resourceErrorCallback(dispatch, newResource));
    }
}

export function fetchApiInfo() {
    return function (dispatch, getState) {
        axios.get(apiPath.apiinfo)
            .then(response => {
                dispatch({
                    type: actionType.APIINFO_FETCH_SUCCESS,
                    data: response.data
                });
            }).catch(errHandler(dispatch, "Cannot fetch API info"));
    }
}

export function fetchMediatypes() {
    return function (dispatch, getState) {
        axios.get(apiPath.mediatypes)
            .then(response => {
                dispatch({
                    type: actionType.MEDIATYPES_FETCH_SUCCESS,
                    data: response.data.map(processMediatype).filter(x => x),
                });
            }).catch(errHandler(dispatch, "Cannot fetch mediatypes"));
    }
}

export function fetchLanguages() {
    return function (dispatch, getState) {
        axios.get(apiPath.languages)
            .then(response => {
                response.data.map(addLanguageMapping);
                dispatch({
                    type: actionType.LANGUAGES_FETCH_SUCCESS,
                    data: response.data
                            .map(x => processLanguage(x[0]))
                            .filter(x => x)
                            .sort((a,b) => a.label.localeCompare(b.label)),
                });
            }).catch(errHandler(dispatch, "Cannot fetch languages"));
    }
}

export function fetchAllTools() {
    return function (dispatch, getState) {
        axios.get(apiPath.tools, {params:{withContent:true}})
            .then(response => {
                response.data.forEach(normalizeTool);
                dispatch({
                    type: actionType.ALL_TOOLS_FETCH_SUCCESS,
                    data: response.data,
                });
            }).catch(errHandler(dispatch, "Cannot fetch all tools data"));
    }
}

function fetchMatchingTools() {
    return function (dispatch, getState) {
        dispatch({
            type: actionType.MATCHING_TOOLS_FETCH_START,
        })

        const profiles = getState().resourceList
                .filter(r => r.localLink && r.profile)
                .map(r => Object.assign({}, r.profile, {contentIsAvailable: (""+!!r.content)}));

        if (!profiles.length) {
            return;
        }

        axios.post(apiPath.toolsMatch, profiles)
            .then(response => {
                const toolMatches = response.data;

                const tools = toolMatches.map(tm => {
                    const tool = tm.tool;
                    tool.matches = tm.matches;
                    tool.bestMatchPercent = tm.bestMatchPercent;
                    normalizeTool(tool);
                    return tool;
                });
                dispatch({
                    type: actionType.MATCHING_TOOLS_FETCH_SUCCESS,
                    data: tools,
                });
            }).catch(errHandler(dispatch, "Cannot fetch matching tools"));

        _paq.push(['trackEvent', 'Tools', 'MatchTools', JSON.stringify(profiles)]);
    }
}

function normalizeTool(tool) {
    let searchString = "";
    for (const key of ['task', 'name', 'description', 'licence']) {
        searchString += (tool[key] || "").toLowerCase();
    }
    tool.searchString = searchString;

    if (tool.bestMatchPercent == 100 && tool.matches && tool.matches.length) {
        tool.invokeMatchIndex = 0;
    }
}

export function setMode(mode) {
    return function (dispatch, getState) {
        dispatch({
            type: actionType.MODE,
            mode: 'popup',
        });
    }
}

export function showError(errorMessage) {
    return function (dispatch, getState) {
        dispatch({
            type: actionType.ERROR,
            message: errorMessage,
        });
    }
}

function errHandler(dispatch, msg) {
    return function(err) {
        console.log({msg, err, response: err.response});
        msg = msg ? (msg + ": ") : "";

        if (!err.response) {
            dispatch({
                type: actionType.ERROR,
                message: msg + "Connection error",
            });
            return;
        }

        const data = err.response.data || {};
        const errorText = data.message ? data.message : err.response.statusText;

        dispatch({
            type: actionType.ERROR,
            message: msg + errorText,
            url: data.url,
        });
    }
}

export function clearAlerts() {
    return function (dispatch, getState) {
        dispatch({
            type: actionType.CLEAR_ERRORS,
        });
    }
}
