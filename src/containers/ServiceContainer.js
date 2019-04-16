import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    getServicesAction, getServiceDeploymentStatsAction, showGenericModalAction,
    getServiceDetailsAction, toggleLoadBalancerFarmsTasksModalAction, getHighAvailabilitiesAction
} from '../utils/actions';
import { ROUTE_SERVICES, ROUTE_SERVICES_DETAILS, ROUTE_SERVICES_STATISTICS } from '../utils/constants';
import NotFound from '../pages/NotFound';
import { DEFAULT_SERVICE_DEPLOYMENT_COUNT } from '../appConfig';
import { getServices, getServiceDetails, getServiceDeploymentStats, getHighAvailabilities } from '../requests/ServiceAxios';
import ServicesStatistics from '../pages/ServicesStatistics';
import ServiceDetails from '../pages/ServiceDetails';
import Services from '../pages/Services';

class ServiceContainer extends React.PureComponent {

    async componentDidMount() {
        let pathname = this.props.location.pathname;
        if (pathname === ROUTE_SERVICES) {
            await this.fetchServicesAndHighAvailabilitiesAndHandleResult();
        }
        else if (this.isCurrentlyOnServiceDetails()) {
            this.fetchServiceDetails()
        }
        else if (pathname === ROUTE_SERVICES_STATISTICS) {
            this.fetchServicesAndHandleResult()
        }
    }

    async fetchServicesAndHighAvailabilitiesAndHandleResult() {
        let res = await this.fetchServicesAndHandleResult();
        if (res) {
            this.fetchHighAvailabilitiesAndHandleResult();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.isCurrentlyOnServiceDetails()) {
            if (this.props.match && this.props.match.params) {
                const params = this.props.match.params;
                if (params.id && params.id !== prevProps.match.params.id) {
                    this.fetchServiceDetails();
                }
            }
        }
    }

    fetchHighAvailabilitiesAndHandleResult = () => {
        getHighAvailabilities()
            .then(res => {
                this.props.getHighAvailabilitiesAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getHighAvailabilitiesAction({ success: false, error: err })
            })
    }

    isCurrentlyOnServiceDetails = () => {
        return this.props.location.pathname.replace(this.props.match.params.id, ":id") === ROUTE_SERVICES_DETAILS ? true : false;
    }

    fetchServiceDetails = async () => {
        let res;
        try {
            res = await getServiceDetails(this.props.match.params.id)
            this.props.getServiceDetailsAction({ success: true, data: res.data })
        }
        catch (err) {
            this.props.getServiceDetailsAction({ success: false, error: err })
        }

        if (res.data.Service[0]) {
            this.fetchServiceDeploymentAndHandleData(res.data.Service[0].Shortcut)
        }
    }

    fetchServiceDeploymentAndHandleData = (serviceShortcut) => {
        getServiceDeploymentStats(serviceShortcut, DEFAULT_SERVICE_DEPLOYMENT_COUNT)
            .then(res => {
                this.props.getServiceDeploymentStatsAction({ success: true, data: res.data.deployments })
            })
            .catch(err => {
                this.props.getServiceDeploymentStatsAction({ success: false, error: err })
            })
    }

    fetchServicesAndHandleResult = () => {
        getServices()
            .then(res => {
                this.props.getServicesAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getServicesAction({ success: false, error: err })
            })
    }

    render() {
        let pathname = this.props.location.pathname;

        if (pathname === ROUTE_SERVICES) {
            return (
                <Services
                    services={this.props.serviceStore.services}
                    fetchServicesAndHighAvailabilitiesAndHandleResult={this.fetchServicesAndHighAvailabilitiesAndHandleResult} />
            )
        }
        else if (this.isCurrentlyOnServiceDetails()) {
            return (
                <ServiceDetails
                    currentUser={this.props.baseStore.currentUser}
                    toggleLoadBalancerFarmsTasksModalAction={this.props.toggleLoadBalancerFarmsTasksModalAction}
                    serviceDetails={this.props.serviceStore.serviceDetails}
                    fetchServiceDetails={this.fetchServiceDetails} />
            )
        }
        else if (pathname === ROUTE_SERVICES_STATISTICS) {
            return (
                <ServicesStatistics
                    fetchServicesAndHandleResult={this.fetchServicesAndHandleResult}
                    services={this.props.serviceStore.services} />
            )
        }
        else {
            // this shouldnt happen because react-router would throw NotFound component before even reaching here but you know...
            return <NotFound />
        }
    }
}

function mapStateToProps(state) {
    return {
        serviceStore: state.ServiceReducer,
        baseStore: state.BaseReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getServicesAction,
        getServiceDeploymentStatsAction,
        showGenericModalAction,
        getServiceDetailsAction,
        toggleLoadBalancerFarmsTasksModalAction,
        getHighAvailabilitiesAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceContainer);
