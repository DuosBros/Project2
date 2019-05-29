import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    getHealthChecksAction
} from '../utils/actions';
import { ROUTE_HEALTHCHECKS, ROUTE_HEALTH } from '../utils/constants';
import NotFound from '../pages/NotFound';
import { getHealthChecks } from '../requests/HealthCheckAxios';
import HealthChecks from '../pages/HealthChecks';

class HealthContainer extends React.PureComponent {

    componentDidMount() {
        this.fetchAllData()
    }

    fetchAllData = () => {
        this.fetchHealthCheckssAndHandleResult()
    }

    fetchHealthCheckssAndHandleResult = () => {
        getHealthChecks()
            .then(res => {
                this.props.getHealthChecksAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getHealthChecksAction({ success: false, error: err })
            })
    }


    render() {
        let pathname = this.props.location.pathname;

        if (pathname === ROUTE_HEALTHCHECKS) {
            return (
                <HealthChecks
                    healthChecks={this.props.healthStore.healthChecks}
                    fetchHealthCheckssAndHandleResult={this.fetchHealthCheckssAndHandleResult}
                />
            )
        }

        if (pathname === ROUTE_HEALTH) {
            return (
                <Health />
            )
        }

        // this shouldnt happen because react-router would throw NotFound component before even reaching here but you know...
        return <NotFound />
    }
}

function mapStateToProps(state) {
    return {
        healthStore: state.HealthReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getHealthChecksAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HealthContainer);
