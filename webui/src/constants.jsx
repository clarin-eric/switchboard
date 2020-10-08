const urlRoot = window.APP_CONTEXT_PATH;

export const apiPath = {
    api:            `${urlRoot}/api`,
    apiinfo:        `${urlRoot}/api/info`,
    mediatypes:     `${urlRoot}/api/mediatypes`,
    languages:      `${urlRoot}/api/languages`,
    tools:          `${urlRoot}/api/tools`,
    toolsMatch:     `${urlRoot}/api/tools/match`,
    storage:        `${urlRoot}/api/storage`,
    storageInfo:    id => `${urlRoot}/api/storage/${id}/info`,
    logo:           name => `${urlRoot}/api/logos/${name}`,
};

export const clientPath = {
    root:       `${urlRoot}/`,
    input:      `${urlRoot}/input`,
    tools:      `${urlRoot}/tools`,
    help:       `${urlRoot}/help`,
    faq:        `${urlRoot}/help#faq`,
    developers: `${urlRoot}/help#developers`,
    about:      `${urlRoot}/about`,
}

export const actionType = [
    'APIINFO_FETCH_SUCCESS',
    'MEDIATYPES_FETCH_SUCCESS',
    'LANGUAGES_FETCH_SUCCESS',
    'ALL_TOOLS_FETCH_SUCCESS',
    'MATCHING_TOOLS_FETCH_START',
    'MATCHING_TOOLS_FETCH_SUCCESS',
    'RESOURCE_UPDATE',
    'RESOURCE_REMOVE',
    'SELECT_RESOURCE_MATCH',
    'MODE',
    'ERROR',
    'CLEAR_ERRORS',
].reduce((actions, value) => {
    actions[value] = value;
    return actions;
}, {});
