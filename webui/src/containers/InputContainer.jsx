import React from 'react';

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {uploadFile, uploadLink} from '../actions/actions';
import {Input} from '../components/Input';

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({
    onFile: (file) => dispatch(uploadFile(file)),
    onLink: (link) => dispatch(uploadLink(link)),
});

export const InputContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Input));
export const MainInputContainer = () => {
    return <InputContainer title="Add your data"/>;
};