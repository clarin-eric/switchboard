import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createJob } from '../actions/actions';
import { withRouter } from 'react-router-dom'


class CreateJobComp extends React.Component {
    constructor(props) {
        super(props);
        this.onInputText = this.onInputText.bind(this);
        this.onCreateJob = this.onCreateJob.bind(this);
        this.state = {
            text: ''
        };
    }

    onInputText(e) {
        this.setState({ text: e.target.value });
    }

    onCreateJob(e) {
        this.props.createJob(this.state.text);
        // send the user to the BrowseJobs page
        // using the history object from react-router-dom
        this.props.history.push('/jobs');
    }

    render() {
        return (
            <div>
                <h3> Create Job </h3>
                <form>
                    <div className="form-group">
                        <label htmlFor="inputText">Insert text here</label>

                        <div className="input-group  mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroupPrepend">Tokenized Text</span>
                            </div>

                            <input type="text" className="form-control" id="inputText"  aria-describedby="inputGroupPrepend"
                                placeholder="Enter text"
                                value={this.state.text} onChange={this.onInputText} />
                        </div>
                    </div>

                    <button type="button" className="btn btn-primary" onClick={this.onCreateJob}> Submit </button>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({ jobs: state.jobs });

const mapDispatchToProps = (dispatch) => ({
    createJob: (text) => dispatch(createJob(text)),
});

CreateJobComp.propTypes = {
    createJob: PropTypes.func.isRequired,
};

export const CreateJob = withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateJobComp));

