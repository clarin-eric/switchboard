import axios from 'axios';
import { apiPath, actionType, resourceMatchSettings } from '../constants';
import { processLanguage, processMediatype } from './utils';


export function updateResource(resource) {
    return function (dispatch, getState) {
        dispatch({
            type: actionType.RESOURCE_UPDATE,
            data: resource,
        });

        if (resource.localLink) {
            const withContent = !!resource.content;
            dispatch(fetchMatchingTools(resource.profile, withContent));
        }
    }
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
        dispatch(updateResource({state: 'uploading'}));
        axios.get(apiPath.storageInfo(id))
            .then(response => {
                const resource = response.data;

                if (resource.localLink && resource.localLink.startsWith(apiPath.api)) {
                    resource.localLink = window.origin + resource.localLink;
                }
                resource.state = 'stored';
                dispatch(updateResource(resource));
            })
            .catch(error => {
                dispatch(updateResource({state: 'error'}));
                errHandler(dispatch)(error);
            });
    }
}

export function showResourceError(errorMessage) {
    return function (dispatch, getState) {
        dispatch(updateResource({state: 'error'}));
        dispatch({
            type: actionType.ERROR,
            message: errorMessage,
        });
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

function uploadData(formData) {
    return function (dispatch, getState) {
        dispatch(updateResource({state: 'uploading'}));
        axios
            .post(apiPath.storage, formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            })
            .then(response => {
                const resource = response.data;

                if (resource.localLink && resource.localLink.startsWith(apiPath.api)) {
                    resource.localLink = window.origin + resource.localLink;
                }
                resource.state = 'stored';
                dispatch(updateResource(resource));
            })
            .catch(error => {
                dispatch(updateResource({state: 'error'}));
                errHandler(dispatch)(error);
            });
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
                dispatch({
                    type: actionType.LANGUAGES_FETCH_SUCCESS,
                    data: response.data.map(processLanguage).filter(x => x),
                });
            }).catch(errHandler(dispatch, "Cannot fetch languages"));
    }
}

export function fetchAllTools() {
    return function (dispatch, getState) {
        axios.get(apiPath.tools)
            .then(response => {
                response.data.forEach(normalizeTool);
                dispatch({
                    type: actionType.ALL_TOOLS_FETCH_SUCCESS,
                    data: response.data,
                });
            }).catch(errHandler(dispatch, "Cannot fetch all tools data"));
    }
}

export function fetchMatchingTools(profile, withContent) {
    return function (dispatch, getState) {
        dispatch({
            type: actionType.MATCHING_TOOLS_FETCH_START,
        })

        axios.post(apiPath.toolsMatch, profile, {params:{withContent}})
            .then(response => {
                response.data.forEach(normalizeTool);
                dispatch({
                    type: actionType.MATCHING_TOOLS_FETCH_SUCCESS,
                    data: response.data,
                });
            }).catch(errHandler(dispatch, "Cannot fetch matching tools"));
        _paq.push(['trackEvent', 'Tools', 'MatchTools', profile.mediaType, profile.language]);
    }
}

function normalizeTool(tool) {
    let searchString = "";
    for (const key of ['task', 'name', 'description', 'licence']) {
        searchString += (tool[key] || "").toLowerCase();
    }
    tool.searchString = searchString;
}

export function errHandler(dispatch, msg) {
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
