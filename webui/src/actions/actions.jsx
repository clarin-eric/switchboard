import axios from 'axios';
import { apiPath, actionType, resourceMatchSettings, NO_MEDIATYPE } from '../constants';
import { processLanguage, processMediatype } from './utils';


export function updateResource(resource) {
    return function (dispatch, getState) {
        dispatch({
            type: actionType.RESOURCE_UPDATE,
            data: resource,
        });

        if (resource.localLink) {
            dispatch(fetchMatchingTools(resource.profile.mediaType, resource.profile.language));
        }
    }
}

export function uploadLink(link, origin) {
    var formData = new FormData();
    formData.append("link", link);
    formData.append("origin", origin);
    return uploadData(formData);
}

export function uploadFile(file) {
    var formData = new FormData();
    formData.append("file", file, file.name);
    return uploadData(formData);
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

                resource.profile.mediaType = resource.profile.mediaType || NO_MEDIATYPE;

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

export function fetchMatchingTools(mediatype, language) {
    return function (dispatch, getState) {
        // set language to 'undetermined' if it's not set
        // so we only match tools that take any language
        language = language || "und";
        const params = {
            mediatype: mediatype,
            language: language,
        }

        dispatch({
            type: actionType.MATCHING_TOOLS_FETCH_START,
        })

        axios.get(apiPath.tools, {params})
            .then(response => {
                response.data.forEach(normalizeTool);
                dispatch({
                    type: actionType.MATCHING_TOOLS_FETCH_SUCCESS,
                    data: response.data,
                });
            }).catch(errHandler(dispatch, "Cannot fetch tools data"));
        _paq.push(['trackEvent', 'Tools', 'MatchTools', mediatype, language]);
    }
}

function normalizeTool(tool) {
    let searchString = "";
    for (const key of ['task', 'name', 'description']) {
        searchString += tool[key].toLowerCase();
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
