import {connect} from 'react-redux';
import {NavBar} from '../components/NavBar';

const mapStateToProps = (state) => (state);
const mapDispatchToProps = (dispatch) => ({});
export const NavBarContainer = connect(mapStateToProps, mapDispatchToProps)(NavBar);
