import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    getHealthChecksAction, searchServiceShortcutAction, getServiceServersAction, deleteServiceServerAction,
    getVersionsAction, getHealthsAction
} from '../utils/actions';
import { ROUTE_HEALTHCHECKS, ROUTE_HEALTH } from '../utils/constants';
import NotFound from '../pages/NotFound';
import { getHealthChecks } from '../requests/HealthAxios';
import HealthChecks from '../pages/HealthChecks';
import Health from '../pages/Health';
import { handleServiceShortcutSearch } from '../handlers/ServiceHandler';

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

    handleServiceShortcutSearchChange = (e) => {
        handleServiceShortcutSearch(e, this.props.searchServiceShortcutAction)
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
                <Health
                    serviceServers={this.props.serviceStore.serviceServers}
                    handleServiceShortcutSearchChange={this.handleServiceShortcutSearchChange}
                    options={this.props.headerStore.searchServiceShortcutsResult.slice(0, 10)}
                    getServiceServersAction={this.props.getServiceServersAction}
                    deleteServiceServerAction={this.props.deleteServiceServerAction}
                    getVersionsAction={this.props.getVersionsAction}
                    getHealthsAction={this.props.getHealthsAction} />
            )
        }

        // this shouldnt happen because react-router would throw NotFound component before even reaching here but you know...
        return <NotFound />
    }
}

function mapStateToProps(state) {
    return {
        healthStore: state.HealthReducer,
        headerStore: state.HeaderReducer,
        serviceStore: state.ServiceReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getHealthChecksAction,
        searchServiceShortcutAction,
        getServiceServersAction,
        deleteServiceServerAction,
        getVersionsAction,
        getHealthsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HealthContainer);
