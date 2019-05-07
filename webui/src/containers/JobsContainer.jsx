import {connect} from 'react-redux';
import {createJob} from '../actions/actions';
import {BrowseJobs} from '../components/BrowseJobs';
import {CreateJob} from '../components/CreateJob';
import {Job} from '../components/Job';

const mapStateToProps = (state) => ({jobs: state.jobs});

const mapDispatchToProps = (dispatch) => ({
    createJob: (text) => dispatch(createJob(text)),
});

export const BrowseJobsContainer = connect(mapStateToProps, mapDispatchToProps)(BrowseJobs);
export const CreateJobContainer = connect(mapStateToProps, mapDispatchToProps)(CreateJob);
export const JobContainer = connect(mapStateToProps, mapDispatchToProps)(Job);
