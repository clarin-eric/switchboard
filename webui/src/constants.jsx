const urlRoot = ""; // window.location.origin;

export const apiPath = {
    apiinfo:        `${urlRoot}/api/info`,
    split:           `${urlRoot}/api/split`,
};


export const actionType = {
    APIINFO_FETCH_SUCCESS: 'APIINFO_FETCH_SUCCESS',

    JOB_SUBMITTED: 'JOB_SUBMITTED',
    JOB_DONE: 'JOB_DONE',
    JOB_REMOVE: 'JOB_REMOVE',

    ERROR: 'ERROR',
};
