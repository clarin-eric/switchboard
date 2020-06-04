import {connect} from 'react-redux';
import {clearAlerts} from '../actions/actions';
import {Alerts} from '../components/Alerts';

const mapStateToProps = (state) => ({
    alerts: state.alerts,
    mode: state.mode,
});
const mapDispatchToProps = (dispatch) => ({
    clearAlerts: () => dispatch(clearAlerts()),
});
export const AlertsContainer = connect(mapStateToProps, mapDispatchToProps)(Alerts);
