import {connect} from 'react-redux';
import {Main} from '../components/Main';
import {setResourceProfile, setResourceContent, removeResource, uploadLink, selectResourceMatch, toggleZipEntryToInputs} from '../actions/actions';

const mapStateToProps = (state) => (state);
const mapDispatchToProps = (dispatch) => ({
    setResourceProfile: (id, profileKey, value) => dispatch(setResourceProfile(id, profileKey, value)),
    setResourceContent: (id, content) => dispatch(setResourceContent(id, content)),
    toggleZipEntryToInputs: (zipID, zipEntry) => dispatch(toggleZipEntryToInputs(zipID, zipEntry)),
    removeResource: (res) => dispatch(removeResource(res)),
    uploadLink: (link) => dispatch(uploadLink(link)),
    selectResourceMatch: (toolName, matchIndex) => dispatch(selectResourceMatch(toolName, matchIndex)),
});
export const MainContainer = connect(mapStateToProps, mapDispatchToProps)(Main);
