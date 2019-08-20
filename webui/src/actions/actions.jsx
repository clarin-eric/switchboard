import axios from 'axios';
import { apiPath, actionType } from '../constants';

// todo: remove?
// function createAction(name) {
//     const f = function (data) {
//         return {
//             type: name,
//             data,
//         }
//     };
//     f.toString = function() {
//         return name;
//     };
//     return f;
// }
// const APIINFO_FETCH_SUCCESS = createAction('APIINFO_FETCH_SUCCESS');

export function fetchApiInfo() {
    return function (dispatch, getState) {
        axios.get(apiPath.apiinfo)
            .then(response => {
                dispatch({
                    type: actionType.APIINFO_FETCH_SUCCESS,
                    data: response.data
                });
            }).catch(errHandler(dispatch, "Cannot fetch API info."));
    }
}

export function fetchMediatypes() {
    return function (dispatch, getState) {
        axios.get(apiPath.mediatypes)
            .then(response => {
                dispatch({
                    type: actionType.MEDIATYPES_FETCH_SUCCESS,
                    data: response.data
                });
            }).catch(errHandler(dispatch, "Cannot fetch mediatypes."));
    }
}

export function fetchLanguages() {
    return function (dispatch, getState) {
        axios.get(apiPath.languages)
            .then(response => {
                dispatch({
                    type: actionType.LANGUAGES_FETCH_SUCCESS,
                    data: response.data
                });
            }).catch(errHandler(dispatch, "Cannot fetch languages."));
    }
}

export function fetchAllTools(deploymentStatus) {
    return function (dispatch, getState) {
        const params = {
            deployment: (deploymentStatus === "production") ? "production" : "development",
            sortBy: 'tools',
        }

        axios.get(apiPath.tools, {params})
            .then(response => {
                dispatch({
                    type: actionType.ALL_TOOLS_FETCH_SUCCESS,
                    data: response.data
                });
            }).catch(errHandler(dispatch, "Cannot fetch all tools data."));
    }
}

export function fetchMatchingTools(mimetype, language, deploymentStatus, includeWS) {
    return function (dispatch, getState) {
        const params = {
            mediatype: mediatype,
            language: language,
            deployment: (deploymentStatus === "production") ? "production" : "development",
            includeWS: includeWebServices ? "yes" : "no",
            sortBy: 'tools',
        }

        axios.get(apiPath.tools, {params})
            .then(response => {
                dispatch({
                    type: actionType.MATCHING_TOOLS_FETCH_SUCCESS,
                    data: response.data
                });
            }).catch(errHandler(dispatch, "Cannot fetch tools data."));
    }
}

export function errHandler(dispatch, msg) {
    return function(err) {
        const alert = (message) => {
            console.warn(message);
            dispatch({
                type: actionType.ERROR,
                message: message,
            });
        };
        const response = err.response || {};
        if (response.status == 401) {
            alert("Please login");
        } else if (response.status == 403) {
            alert("Access denied. "+(response.data || ""));
        } else {
            if (!msg && err.response) {
                msg ="An error occurred while contacting the server.";
            }
            if (response.data && response.data.message) {
                msg += " " + response.data.message;
            }
            if (msg) {
                alert(msg);
            } else {
                console.error(err);
            }
        }
    }
}
