import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

class JobComp extends React.Component {
    constructor(props) {
        super(props);
    }

    renderNotFound() {
        return (
            <div>
                <h1>Job ?</h1>
                <p>Job Not Found</p>
            </div>
        );
    }

    render() {
        // get the jobId from the router or from passed props
        const id = this.props.match.params.id || this.props.jobId || {};

        if (!this.props.jobs || !id) {
            return this.renderNotFound();
        }

        const job = this.props.jobs.find(j => j.id == id);
        if (!job) {
            return this.renderNotFound();
        }

        let statusReport = "";
        if (job.status === 'done') {
            statusReport = 
            <div>
                <p className="card-text">Untokenized: {job.tokenizedText}</p>
                <span className="badge badge-pill badge-success">{job.status}</span>
            </div>
        } else {
            statusReport = 
            <div>
                <span className="badge badge-pill badge-warning">{job.status}</span>
            </div>
        }

        return (
            <div className="card">
                <div className="card-body">
                    {this.props.linkTo
                    ? <Link to={this.props.linkTo}><h5 className="card-title">Job {job.id}</h5></Link>
                    : <h5 className="card-title">Job {job.id}</h5>
                    }
                    <p className="card-text">Original text: {job.originalText}</p>
                    {statusReport}
                </div>
            </div>
        );
    }
}

JobComp.propTypes = {
    jobs: PropTypes.array,
    jobId: PropTypes.number, // optional, in case jobId is not determined by the router
    linkTo: PropTypes.string // optional
};

const mapStateToProps = (state) => ({jobs: state.jobs});

export const Job = withRouter(connect(mapStateToProps)(JobComp));

