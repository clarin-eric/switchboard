import {connect} from 'react-redux';
import {ToolList} from '../components/ToolList';

const mapStateToProps = (state) => ({tools: state.allTools || {}});
export const ToolListContainer = connect(mapStateToProps)(ToolList);
