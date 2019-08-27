import {connect} from 'react-redux';
import {Main} from '../components/Main';
import {updateResource} from '../actions/actions';

const mapStateToProps = (state) => (state);
const mapDispatchToProps = (dispatch) => ({
    updateResource: (res) => dispatch(updateResource(res)),
});
export const MainContainer = connect(mapStateToProps, mapDispatchToProps)(Main);
