import axios from 'axios';
import { push } from 'react-router-redux';
import { apiPath, actionType } from '../constants';

let JOBID = 1;

export function fetchApiInfo() {
    return function (dispatch, getState) {
        axios.get(apiPath.apiinfo).then(response => {
            dispatch({
                type: actionType.APIINFO_FETCH_SUCCESS,
                info: response.data
            });
        }).catch(errHandler(dispatch, "Cannot fetch API info."));
    }
}

export function createJob(text) {
    return function (dispatch, getState)  {
        const fd = new FormData(); fd.append("text", text);
        const job = {
            id: JOBID++,
            originalText: text,
            tokenizedText: null,
            status: 'in progress',
        };

        dispatch({
            type: actionType.JOB_SUBMITTED,
            job: job,
        });

        axios
        .post(apiPath.split, fd)
        .then(response => {
            job.tokenizedText = response.data;
            job.status = 'done';
            dispatch({
                type: actionType.JOB_DONE,
                job: job,
            });
        })
        .catch(errHandler(dispatch, "Cannot create job."));
    }
}

export function removeJobs(jobIDList) {
    return function (dispatch, getState)  {
        for (id in jobIDList) {
            dispatch({
                type: actionType.JOB_REMOVE,
                id: id,
            });
        }
    }
}



export function errHandler(dispatch, msg) {
    return function(err) {
        // TOOD: check that alerts are shown
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
