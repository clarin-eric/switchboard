import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {uploadFiles, uploadText} from '../actions/actions';
import {Input} from '../components/Input';

const mapStateToProps = (state) => ({});
// const mapDispatchToProps = (dispatch) => ({
//     ...bindActionCreators(actions, dispatch)
// });
const mapDispatchToProps = (dispatch) => ({
    onFiles: (files) => uploadFiles(files),
    onText: (text) => uploadText(text),
});
export const InputContainer = connect(mapStateToProps, mapDispatchToProps)(Input);
