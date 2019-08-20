const urlRoot = window.APP_CONTEXT_PATH;

export const apiPath = {
    apiinfo:    `${urlRoot}/api/info`,
    mediatypes: `${urlRoot}/api/mediatypes`,
    languages:  `${urlRoot}/api/languages`,
    tools:      `${urlRoot}/api/tools`,
};

export const actionType = {
    APIINFO_FETCH_SUCCESS:          'APIINFO_FETCH_SUCCESS',
    MEDIATYPES_FETCH_SUCCESS:       'MEDIATYPES_FETCH_SUCCESS',
    LANGUAGES_FETCH_SUCCESS:        'LANGUAGES_FETCH_SUCCESS',
    ALL_TOOLS_FETCH_SUCCESS:        'ALL_TOOLS_FETCH_SUCCESS',
    MATCHING_TOOLS_FETCH_SUCCESS:   'MATCHING_TOOLS_FETCH_SUCCESS',
    ERROR:                          'ERROR',
};
