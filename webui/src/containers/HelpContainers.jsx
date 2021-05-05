import {connect} from 'react-redux';
import About from '../components/About';
import Help from '../components/Help';

const mapStateToProps = (state) => ({contact: state.apiinfo.contactEmail, fundingBadge: state.apiinfo.fundingBadge});
export const AboutContainer = connect(mapStateToProps)(About);
export const HelpContainer = connect(mapStateToProps)(Help);
