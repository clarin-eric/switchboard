import SI from 'seamless-immutable';
import axios from 'axios';
import { apiPath, actionType } from '../constants';
import { addLanguageMapping, processLanguage, processMediatype, isDictionaryResource, isDictionaryTool, isNotDictionaryTool } from './utils';

let lastResourceID = 0;

function updateResource(resource) {
    return function (dispatch, getState) {
        dispatch({
            type: actionType.RESOURCE_UPDATE,
            data: resource,
        });
        dispatch(fetchMatchingTools());
    }
}

export function setResourceProfile(id, profileKey, value) {
    return function (dispatch, getState) {
        const resourceList = getState().resourceList;
        const resourceSI = resourceList.find(r => r.id === id);
        if (!resourceSI) {
            console.error("cannot find resource with id", id);
            return;
        }
        const resource = SI.asMutable(resourceSI, {deep:true});
        resource.profile[profileKey] = value;

        dispatch({
            type: actionType.RESOURCE_UPDATE,
            data: resource,
        });
        // update matching tools because the profile has changed
        dispatch(fetchMatchingTools());

        if (resource.sourceID) {
            let parent = resourceList.find(r => r.id === resource.sourceID);
            if (parent) {
                parent = SI.asMutable(parent, {deep:true});
                const entry = parent.outline.find(e => e.name == resource.sourceEntryName);
                if (entry) {
                    entry.profile = Object.assign({}, entry.profile, resource.profile);
                    dispatch({
                        type: actionType.RESOURCE_UPDATE,
                        data: {id: parent.id, outline: parent.outline},
                    });
                }
            }
        }
    }
}

const contentDispatchers = {};
export function setResourceContent(id, content) {
    return function (dispatch, getState) {
        const resourceSI = getState().resourceList.find(r => r.id === id);
        if (!resourceSI) {
            console.error("cannot find resource with id", id);
            return;
        }
        const resource = SI.asMutable(resourceSI, {deep:true});
        resource.content = content;
        dispatch({
            type: actionType.RESOURCE_UPDATE,
            data: resource,
        });

        // set content on server with a slight delay to coalesce repeated calls
        // don't update matching tools because the profile is the same
        if (contentDispatchers[id]) {
            clearTimeout(contentDispatchers[id]);
            contentDispatchers[id] = null;
        }
        const putCall = () => {
            const headers = {'Content-Type': 'text/plain'};
            axios.put(apiPath.storageID(id), content, { headers });
        }
        contentDispatchers[id] = setTimeout(putCall, 500);
    }
}

export function clearResources() {
    return function (dispatch, getState) {
        dispatch({
            type: actionType.RESOURCE_CLEAR_ALL,
        });
    }
}

export function removeResource(resource) {
    return function (dispatch, getState) {
        dispatch({
            type: actionType.RESOURCE_REMOVE,
            data: new Set([resource.id]),
        });

        if (resource.sourceID && resource.sourceEntryName) {
            const parent = getState().resourceList.find(r => r.id == resource.sourceID);
            const outline = SI.asMutable(parent && parent.outline ? parent.outline : [], {deep:true});
            const entry = outline.find(e => e.name === resource.sourceEntryName);
            if (entry) {
                entry.checked = false;
                dispatch({
                    type: actionType.RESOURCE_UPDATE,
                    data: {id: parent.id, outline},
                });
            }
        }

        const dependants = getState().resourceList.filter(r => r.sourceID === resource.id).map(r => r.id);
        if (dependants && dependants.length) {
            dispatch({
                type: actionType.RESOURCE_REMOVE_SOURCE,
                data: new Set(dependants),
            });
        }

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

export function toggleArchiveEntryToInputs(archiveRes, archiveEntry) {
    return function (dispatch, getState) {
        const {apiinfo, resourceList} = getState();

        const outline = SI.asMutable(archiveRes.outline, {deep:true});
        if (!apiinfo?.enableMultipleResources) {
            const list = resourceList.filter(r => r.sourceID == archiveRes.id).map(r => r.id);
            dispatch({
                type: actionType.RESOURCE_REMOVE,
                data: new Set(list),
            });

            outline.forEach(e => {e.checked = false})
        }
        const entry = outline.find(e => e.name === archiveEntry.name);
        if (entry.checked) {
            if (apiinfo?.enableMultipleResources) {
                entry.checked = false;
                const resource = resourceList.find(r =>
                    r.sourceID === archiveRes.id && r.sourceEntryName === archiveEntry.name);
                if (resource) {
                    dispatch(removeResource(resource));
                }
                return;
            } else {
                // single resource, already checked
                return;
            }
        } else {
            entry.checked = true;
        }
        dispatch({
            type: actionType.RESOURCE_UPDATE,
            data: {id: archiveRes.id, outline},
        });

        var formData = new FormData();
        formData.append("archiveID", archiveRes.id);
        formData.append("archiveEntryName", archiveEntry.name);
        if (archiveEntry.profile) {
            formData.append("profile", JSON.stringify(archiveEntry.profile));
        }

        const newResource = {id: ++lastResourceID, sourceID: archiveRes.id, sourceEntryName: archiveEntry.name};
        dispatch(updateResource(newResource));
        axios
            .post(apiPath.storage, formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            })
            .then(updateResourceCallback(dispatch, newResource, getState))
            .catch(resourceErrorCallback(dispatch, newResource));
    }
}

export function toggleCompressedResource(resource) {
    return function (dispatch, getState) {
        if (resource.originalResource) {
            // removeResource(resource);
        } else {
            //-- it must be compressed, post to server to uncompress it
            const newResource = {id: ++lastResourceID, originalResource: SI.asMutable(resource, {deep:true})};
            dispatch(updateResource(newResource));
            dispatch(removeResource(resource));

            var formData = new FormData();
            formData.append("archiveID", resource.id);
            axios
                .post(apiPath.storage, formData, {
                    headers: {'Content-Type': 'multipart/form-data'}
                })
                .then(updateResourceCallback(dispatch, newResource, getState))
                .catch(error => {
                    dispatch(updateResource(resource));
                    dispatch(removeResource(newResource));
                    errHandler(dispatch)(error);
                });
        }
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

function updateResourceCallback(dispatch, resource, getState) {
    return response => {
        const res = response.data;
        if (res.localLink && res.localLink.startsWith(apiPath.api)) {
            res.localLink = window.origin + res.localLink;
        }
        if (resource.id !== res.id) {
            // don't call removeResource which does other things, just erase it
            dispatch({
                type: actionType.RESOURCE_REMOVE,
                data: new Set([resource.id]),
            });
        }
        res.isDictionaryResource = isDictionaryResource(res);
        dispatch(updateResource(Object.assign({}, resource, res)));

        if (!res.outline) {
            axios
                .get(apiPath.storageOutline(res.id))
                .then(outlineResponse => {
                    dispatch({
                        type: actionType.RESOURCE_UPDATE,
                        data: Object.assign({id: res.id}, outlineResponse.data),
                    });
                }).catch(error => {
                    console.warn("error when getting outline: ", error);
                });
        }

        if (getState && resource.sourceID && resource.sourceEntryName) {
            // set the entry's profile in parent, if it's unset
            const parentResource = getState().resourceList.find(r => r.id == resource.sourceID);
            if (parentResource) {
                const outline = SI.asMutable(parentResource.outline, {deep:true});
                const entry = outline.find(e => e.name == res.sourceEntryName);
                if (entry && !entry.profile) {
                    entry.profile = Object.assign({}, res.profile);
                    dispatch({
                        type: actionType.RESOURCE_UPDATE,
                        data: {id: parentResource.id, outline},
                    });
                }
            }
        }
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

function fetchMatchingTools() {
    return function (dispatch, getState) {
        dispatch({
            type: actionType.MATCHING_TOOLS_FETCH_START,
        })

        const allResources = SI.asMutable(getState().resourceList, {deep:true});
        const resourceList = allResources.filter(r => !r.isArchive);
        const isDict = resourceList.every(r => r.isDictionaryResource);

        const profiles = resourceList
                .filter(r => r.localLink && r.profile)
                .map(r => {
                    const ret = Object.assign({}, r.profile);
                    if (r.content) {
                        ret["contentIsAvailable"] = true;
                    }
                    return ret;
                });

        if (!profiles.length) {
            return;
        }

        axios.post(apiPath.toolsMatch, profiles)
            .then(response => {
                const toolMatches = response.data;
                // find correct matching indices (we have archive resources, which are sources for others)
                toolMatches.forEach(toolMatch => {
                    toolMatch.matches = toolMatch.matches.map(indicesList =>
                        indicesList.map(index => index < 0 ? index :
                            allResources.findIndex(r => r.id === resourceList[index].id)
                        )
                    );
                });

                const tools = toolMatches.map(tm => {
                    const tool = tm.tool;
                    tool.matches = tm.matches;
                    tool.bestMatchPercent = tm.bestMatchPercent;
                    normalizeTool(tool);
                    return tool;
                })
                .filter(isDict ? isDictionaryTool : isNotDictionaryTool);

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
    for (const key of ['task', 'name', 'description']) {
        searchString += (tool[key] || "").toLowerCase();
        searchString += " ";
    }
    for (const kw in (tool.keywords||[])) {
        searchString += kw.toLowerCase();
        searchString += " ";
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
        msg = msg ? (msg + ": ") : "";

        let data = {};
        let errorText = "Connection error";

        if (err.message && err.stack) {
            errorText = err.message;
        }
        if (err.response) {
            data = err.response.data || {};
            errorText = data.message ? data.message : err.response.statusText;
        }

        dispatch({
            type: actionType.ERROR,
            message: msg + errorText,
            url: data.url,
        });
        throw err;
    }
}

export function clearAlerts() {
    return function (dispatch, getState) {
        dispatch({
            type: actionType.CLEAR_ERRORS,
        });
    }
}
