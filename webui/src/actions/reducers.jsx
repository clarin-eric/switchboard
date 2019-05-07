import SI from 'seamless-immutable';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import { actionType } from '../constants';

function apiinfo(state = SI({}), action) {
    switch (action.type) {
        case actionType.APIINFO_FETCH_SUCCESS:
            return SI(action.info);
        default:
            return state;
    }
}

function jobs(state = SI([]), action) {
    switch (action.type) {
        case actionType.JOB_SUBMITTED:
        case actionType.JOB_DONE: {
            let mutable = state.asMutable();
            let index = mutable.findIndex(j => j.id == action.job.id);
            if (index >= 0) {
                mutable[index] = action.job;
            } else {
                mutable.push(action.job);
            }
            return SI(mutable);
        }
        case actionType.JOB_REMOVE: {
            let mutable = state.asMutable();
            let index = mutable.findIndex(j => j.id == action.job.id);
            if (index >= 0) {
                mutable.splice(index, 1);
            }
            return SI(mutable);
        }
        default:
            return state;
    }
}

function alerts(state = SI([]), action) {
    switch (action.type) {
        case actionType.ERROR:
            let mutable = state.asMutable();
            mutable.push(action.message);
            return SI(mutable);
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    apiinfo,
    jobs,
    alerts,
    form: formReducer,
    routing: routerReducer
});

export default rootReducer;
