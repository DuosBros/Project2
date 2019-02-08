import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class LoadBalancerFarmsStatistics extends React.Component {
    render() {
        return (
            <div></div>
        )
    }
}

function mapStateToProps(state) {
    return {
        // baseStore: state.BaseReducer,
        // headerStore: state.HeaderReducer,
        // serviceStore: state.ServiceReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // authenticateAction: authenticateAction,
        // authenticationStartedAction: authenticationStartedAction,
        // authenticateEndedAction: authenticateEndedAction,
        // authenticateOKAction: authenticateOKAction,
        // authenticationFailedAction: authenticationFailedAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadBalancerFarmsStatistics);