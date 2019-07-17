const urlRoot = window.APP_CONTEXT_PATH ; // window.location.origin;

export const apiPath = {
    apiinfo:    `${urlRoot}/api/info`,
    split:      `${urlRoot}/api/split`,
};

export const actionType = {
    APIINFO_FETCH_SUCCESS: 'APIINFO_FETCH_SUCCESS',
};
