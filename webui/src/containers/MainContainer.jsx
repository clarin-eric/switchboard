import {connect} from 'react-redux';
import {Main} from '../components/Main';
import {updateResource, removeResource, uploadLink, selectResourceMatch} from '../actions/actions';

const mapStateToProps = (state) => (state);
const mapDispatchToProps = (dispatch) => ({
    updateResource: (res) => dispatch(updateResource(res)),
    removeResource: (res) => dispatch(removeResource(res)),
    uploadLink: (link) => dispatch(uploadLink(link)),
    selectResourceMatch: (toolName, matchIndex) => dispatch(selectResourceMatch(toolName, matchIndex)),
});
export const MainContainer = connect(mapStateToProps, mapDispatchToProps)(Main);
