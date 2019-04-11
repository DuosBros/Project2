import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getServers, deleteServer, getServerDetails, getServerScomAlerts, getDiskUsageDetails, getServerDeploymentStats } from '../requests/ServerAxios';
import {
    getServersAction, deleteServerAction, showGenericModalAction, getServerDetailsAction, getVmDetailsAction, getServerScomAlertsAction, getServerStatsAction,
    getServerDeploymentStatsAction, getVirtualMachinesAction
} from '../utils/actions';
import ServersAdmin from '../pages/ServersAdmin';
import { ROUTE_SERVERS_ADMIN, ROUTE_SERVERS, ROUTE_SERVER_DETAILS, ROUTE_SERVER_STATISTICS } from '../utils/constants';
import Servers from '../pages/Servers';
import NotFound from '../pages/NotFound';
import ServerDetails from '../pages/ServerDetails';
import { DEFAULT_SERVER_DEPLOYMENT_COUNT } from '../appConfig';
import { getVirtualMachines } from '../requests/VirtualMachineAxios';
import ServersStatistics from '../pages/ServersStatistics';

class ServersContainer extends React.PureComponent {

    componentDidMount() {
        let pathname = this.props.location.pathname;
        if (pathname === ROUTE_SERVERS || pathname === ROUTE_SERVERS_ADMIN) {
            this.fetchServersAndHandleResult()
        }
        else if (this.isCurrentlyOnServerDetails()) {
            this.fetchServerDetails()
        }
        else if (pathname === ROUTE_SERVER_STATISTICS) {
            this.fetchServersAndHandleResult()
            this.fetchVirtualMachinesAndHandleResult()
        }
    }

    componentDidUpdate(prevProps) {
        if (this.isCurrentlyOnServerDetails()) {
            if (this.props.match && this.props.match.params) {
                const params = this.props.match.params;
                if (params.id && params.id !== prevProps.match.params.id) {
                    this.fetchServerDetails();
                }
            }
        }
    }

    componentWillUnmount() {
        if (this.isCurrentlyOnServerDetails()) {
            this.props.getServerScomAlertsAction({ success: true })
        }
    }


    isCurrentlyOnServerDetails = () => {
        return this.props.location.pathname.replace(this.props.match.params.id, ":id") === ROUTE_SERVER_DETAILS ? true : false;
    }

    fetchServerDetails = async () => {
        let serverRes;
        try {
            serverRes = await getServerDetails(this.props.match.params.id)
            this.props.getServerDetailsAction({ success: true, data: serverRes.data })
        }
        catch (err) {
            this.props.getServerDetailsAction({ success: false, error: err });
        }
        let shouldContinue = false
        if (serverRes.data) {
            shouldContinue = true
        }

        if (!shouldContinue) return

        // these calls can be run parallely
        getServerScomAlerts(serverRes.data.ServerName)
            .then(res => {
                this.props.getServerScomAlertsAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getServerScomAlertsAction({ success: false, error: err });
            })

        getDiskUsageDetails(serverRes.data.ServerName)
            .then(res => {
                this.props.getServerStatsAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getServerStatsAction({ success: false, error: err })
            })

        this.fetchServerDeploymentAndHandleData(serverRes.data.ServerName);

    }

    fetchVirtualMachinesAndHandleResult = () => {
        getVirtualMachines()
            .then(res => {
                this.props.getVirtualMachinesAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getVirtualMachinesAction({ success: false, error: err })
            })
    }

    fetchServerDeploymentAndHandleData = (serverName) => {
        getServerDeploymentStats(serverName, DEFAULT_SERVER_DEPLOYMENT_COUNT)
            .then(res => {
                this.props.getServerDeploymentStatsAction({ success: true, data: res.data.deployments })
            })
            .catch(err => {
                this.props.getServerDeploymentStatsAction({ success: false, error: err })
            })
    }

    fetchServersAndHandleResult = () => {
        getServers()
            .then(res => {
                this.props.getServersAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getServersAction({ success: false, error: err })
            })
    }

    handleDeleteServer = (id) => {
        deleteServer(id)
            .then(() => {
                this.props.deleteServerAction(id)
            })
            .catch(err => {
                this.props.showGenericModalAction({
                    err: err,
                    header: "Failed to delete server"
                })
            })
    }

    render() {
        let pathname = this.props.location.pathname;

        if (pathname === ROUTE_SERVERS_ADMIN) {
            return (
                <ServersAdmin servers={this.props.serverStore.servers} fetchServersAndHandleResult={this.fetchServersAndHandleResult} handleDeleteServer={this.handleDeleteServer} />
            )
        }
        else if (pathname === ROUTE_SERVERS) {
            return (
                <Servers servers={this.props.serverStore.servers} fetchServersAndHandleResult={this.fetchServersAndHandleResult} />
            )
        }
        else if (this.isCurrentlyOnServerDetails()) {
            return (
                <ServerDetails serverDetails={this.props.serverStore.serverDetails} scomAlerts={this.props.serverStore.scomAlerts} fetchServersAndHandleResult={this.fetchServersAndHandleResult} />
            )
        }
        else if (pathname === ROUTE_SERVER_STATISTICS) {
            return (
                <ServersStatistics
                    virtualMachines={this.props.virtualMachineStore.virtualMachines}
                    fetchServersAndHandleResult={this.fetchServersAndHandleResult}
                    servers={this.props.serverStore.servers} />
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
        serverStore: state.ServerReducer,
        virtualMachineStore: state.VirtualMachineReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getServersAction,
        deleteServerAction,
        showGenericModalAction,
        getServerDetailsAction,
        getVmDetailsAction,
        getServerScomAlertsAction,
        getServerStatsAction,
        getServerDeploymentStatsAction,
        getVirtualMachinesAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ServersContainer);
