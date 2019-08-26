import {connect} from 'react-redux';
import {ToolList} from '../components/ToolList';

export const AllToolsContainer = connect(
    (state) => ({tools: state.allTools || {}})
)(ToolList);
