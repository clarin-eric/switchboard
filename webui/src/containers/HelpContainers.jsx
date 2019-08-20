import {connect} from 'react-redux';
import About from '../components/About';
import Help from '../components/Help';
import FAQ from '../components/FAQ';
import ForDevelopers from '../components/ForDevelopers';

const mapStateToProps = (state) => ({contact: state.apiinfo.contactEmail});
export const AboutContainer = connect(mapStateToProps)(About);
export const HelpContainer = connect(mapStateToProps)(Help);
export const FAQContainer = connect(mapStateToProps)(FAQ);
export const ForDevelopersContainer = connect(mapStateToProps)(ForDevelopers);
