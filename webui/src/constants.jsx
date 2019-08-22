const urlRoot = window.APP_CONTEXT_PATH;

export const apiPath = {
    api:        `${urlRoot}/api`,
    apiinfo:    `${urlRoot}/api/info`,
    mediatypes: `${urlRoot}/api/mediatypes`,
    languages:  `${urlRoot}/api/languages`,
    tools:      `${urlRoot}/api/tools`,
    storage:    `${urlRoot}/api/storage`,
};

export const actionType = [
    'APIINFO_FETCH_SUCCESS',
    'MEDIATYPES_FETCH_SUCCESS',
    'LANGUAGES_FETCH_SUCCESS',
    'ALL_TOOLS_FETCH_SUCCESS',
    'MATCHING_TOOLS_FETCH_SUCCESS',
    'RESOURCE_INIT',
    'RESOURCE_UPDATE',
    'ERROR',
].reduce((actions, value) => {
    actions[value] = value;
    return actions;
}, {});