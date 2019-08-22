import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import {uploadFile} from '../actions/actions';
import {Input} from '../components/Input';

const mapStateToProps = (state) => ({});
// const mapDispatchToProps = (dispatch) => ({
//     ...bindActionCreators(actions, dispatch)
// });
const mapDispatchToProps = (dispatch) => ({
    onFile: (file) => dispatch(uploadFile(file)),
});
export const InputContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Input));
