import {connect} from 'react-redux';
import {ToolListWithControls} from '../components/ToolList';

export const AllToolsContainer = connect(
    (state) => ({
        title: "Tool Inventory",
        tools: state.allTools || {},
    })
)(ToolListWithControls);
