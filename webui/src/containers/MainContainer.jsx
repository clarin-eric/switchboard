import {connect} from 'react-redux';
import {Main} from '../components/Main';
import {setResourceProfile, setResourceContent, removeResource, uploadLink, selectResourceMatch, toggleArchiveEntryToInputs, extractCompressedResource, toggleTextExtraction, moreContent} from '../actions/actions';

const mapStateToProps = (state) => (state);
const mapDispatchToProps = (dispatch) => ({
    actions: {
        setResourceProfile: (id, profileKey, value) => dispatch(setResourceProfile(id, profileKey, value)),
        setResourceContent: (id, content) => dispatch(setResourceContent(id, content)),
        toggleArchiveEntryToInputs: (archiveID, archiveEntry) => dispatch(toggleArchiveEntryToInputs(archiveID, archiveEntry)),
        extractCompressedResource: (res) => dispatch(extractCompressedResource(res)),
        toggleTextExtraction: (res) => dispatch(toggleTextExtraction(res)),
        removeResource: (res) => dispatch(removeResource(res)),
        uploadLink: (link) => dispatch(uploadLink(link)),
        selectResourceMatch: (toolName, matchIndex) => dispatch(selectResourceMatch(toolName, matchIndex)),
        moreContent: (res) => dispatch(moreContent(res)),
    }
});
export const MainContainer = connect(mapStateToProps, mapDispatchToProps)(Main);
