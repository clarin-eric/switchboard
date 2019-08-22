import {connect} from 'react-redux';
import {Main} from '../components/Main';

const mapStateToProps = (state) => (state);
export const MainContainer = connect(mapStateToProps)(Main);
