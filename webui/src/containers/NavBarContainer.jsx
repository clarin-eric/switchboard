import {connect} from 'react-redux';
import {NavBar} from '../components/NavBar';
import {clearResources} from '../actions/actions';

const mapStateToProps = (state) => (state);
const mapDispatchToProps = (dispatch) => ({
    clearResources: (res) => dispatch(clearResources(res)),
});
export const NavBarContainer = connect(mapStateToProps, mapDispatchToProps)(NavBar);
