import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import { Job } from '../containers/Job';

class BrowseJobsComp extends React.Component {
    constructor(props) {
        super(props);
    }

   renderJob(job) {
    return (
        <Job key={job.id} jobId={job.id} linkTo={"/jobs/" + job.id}/>
    );
    }
    renderJobList() {
        return (
            <div style={{ borderBottom: '1px solid gray', marginBottom: 20 }}>
                {this.props.jobs.map(this.renderJob)}
            </div>
        );
    }

    render() {
        return (
            <div>
                <h3> Browse Jobs </h3>
                {this.props.jobs && this.props.jobs.length
                    ? this.renderJobList()
                    : <p>No jobs found</p>
                }

                <Link to="/jobs/new">
                    <button type="button" className="btn btn-primary">Add Job</button>
                </Link>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({jobs: state.jobs});

BrowseJobsComp.propTypes = {
    jobs: PropTypes.array, // can be null
};

export const BrowseJobs = connect(mapStateToProps)(BrowseJobsComp);

