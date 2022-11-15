import React from 'react';

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {withRouter} from '../reactHelpers';
import {uploadFile, uploadLink, clearResources} from '../actions/actions';
import {Input} from '../components/Input';

const mapStateToProps = (state) => ({});


const mapDispatchToProps = (dispatch) => ({
    onFile: (file) => dispatch(uploadFile(file)),
    onLink: (link) => dispatch(uploadLink(link)),
});
export const InputContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Input));


const mapDispatchToPropsWithCleaning = (dispatch) => ({
    onFile: (file) => {
        dispatch(clearResources())
        dispatch(uploadFile(file))
    },
    onLink: (link) => {
        dispatch(clearResources())
        dispatch(uploadLink(link))
    },
});
const CleanInputContainer = withRouter(connect(mapStateToProps, mapDispatchToPropsWithCleaning)(Input));
export const MainInputContainer = () => {
    return <CleanInputContainer title="Add your data" />;
};
