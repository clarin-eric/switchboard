import {connect} from 'react-redux';
import {Footer} from '../components/Footer';

const mapStateToProps = (state) => state.apiinfo;
export const FooterContainer = connect(mapStateToProps)(Footer);
