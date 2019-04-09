import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon, Message } from 'semantic-ui-react';

import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Home from '../pages/Home';
import ServerDetails from '../pages/ServerDetails';
import ServiceDetails from '../pages/ServiceDetails';
import Login from '../pages/Login';
import UserDetails from '../modals/UserDetails';

import { authenticateAction, authenticationStartedAction, authenticateEndedAction, authenticateOKAction, authenticationFailedAction } from '../utils/actions';
import { authenticate } from '../requests/BaseAxios';
import { debounce, isAdmin } from '../utils/HelperFunction';

import { LOCO_API } from '../appConfig';
import LoadBalancerFarmsTasks from '../modals/LoadBalancerFarmsTasks';
import ServersTable from '../components/ServersTable';
import PatchGroups from '../pages/PatchGroups';
import RolloutStatus from '../pages/RolloutStatus';
import VirtualMachines from '../pages/VirtualMachines';
import Services from '../pages/Services';
import LoadBalancerFarms from '../pages/LoadBalancerFarms';
import IPAddresses from '../pages/IPAddresses';
import Admin from '../pages/Admin';
import VersionStatus from '../pages/VersionStatus';
import PatchGroupDetails from '../pages/PatchGroupDetails';
import ServicesStatistics from '../pages/ServicesStatistics';
import ServersStatistics from '../pages/ServersStatistics';
import LoadBalancerFarmsStatistics from '../pages/LoadBalancerFarmsStatistics';
import ErrorBoundary from '../components/ErrorBoundary';
import HealthChecks from '../pages/HealthChecks';
import Statistics from '../pages/Statistics';
import LoadBalancersAdmin from '../pages/LoadBalancersAdmin';
import ScrollToTop from './ScrollToTop';
import ActiveDirectoryAdmin from '../pages/ActiveDirectoryAdmin';
import AgentLogs from '../pages/AgentLogs';
import NotFound from '../pages/NotFound';
import PrivateRoute from './PrivateRoute';
import ServiceVirtualMachine from '../pages/ServiceVirtualMachine';
import GenericModal from '../components/GenericModal';
import ServersContainer from '../containers/ServersContainer';
import { ROUTE_SERVERS, ROUTE_SERVERS_ADMIN } from './constants';

class Base extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            authExceptionMessage: "",
            authExceptionResponse: "",
            width: window.innerWidth
        }

        this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this)

        var debounceResize = debounce(this.handleWindowSizeChange, 250);

        window.addEventListener('resize', debounceResize)

        props.authenticationStartedAction();

        authenticate()
            .then(res => {
                this.props.authenticateAction(res.data)
                this.props.authenticateEndedAction();
                this.props.authenticateOKAction();
            })
            .catch((err) => {
                if (err.response) {
                    this.setState({ authExceptionMessage: err.message ? err.message : '', authExceptionResponse: err.response ? err.response : '' })
                }
                else {
                    this.setState({ authExceptionMessage: ("Could not connect to " + LOCO_API) })
                }

                this.props.authenticationFailedAction();
                this.props.authenticateEndedAction();
            })
    }



    handleWindowSizeChange() {
        this.setState({ width: window.innerWidth });
    }

    render() {
        const { width } = this.state;
        var isMobile = width <= 766;

        if (!this.props.baseStore.authenticationDone) {
            return (
                <div className="messageBox">
                    <Message info icon >
                        <Icon name='circle notched' loading />
                        <Message.Content content={
                            <Message.Header>Authentication...</Message.Header>
                        }>
                        </Message.Content>
                    </Message>
                </div>
            );
        }

        if (this.props.baseStore.authenticationFailed) {
            return (<Login ex={this.state} />);
        }

        var wideClass = {
            className: ""
        };

        if (!this.props.headerStore.showVerticalMenu) {
            wideClass.className = "wide"
        }

        let genericModal;
        if (this.props.baseStore.showGenericModal) {
            genericModal = (
                <GenericModal
                    show={this.props.baseStore.showGenericModal}
                    header={this.props.baseStore.modal.modalHeader}
                    content={this.props.baseStore.modal.modalContent}
                    redirectTo={this.props.baseStore.modal.redirectTo}
                    parentProps={this.props.baseStore.modal.parentProps}
                    err={this.props.baseStore.modal.err} />
            )
        }

        return (
            <div>
                <BrowserRouter>
                    <ScrollToTop>
                        {genericModal}
                        <Route path="/:entityType?/:entityId?" render={(props) => <Header {...props} isMobile={isMobile} />} />
                        <Sidebar isMobile={isMobile} />
                        <LoadBalancerFarmsTasks show={this.props.serviceStore.showLoadBalancerFarmsTasksModal} />
                        <UserDetails userDetails={this.props.baseStore.currentUser} show={this.props.headerStore.showUserDetails} />
                        <div id="bodyWrapper" {...wideClass}>
                            <ErrorBoundary>
                                <Switch>
                                    <Route exact path='/site/check' render={() => <div>CHECK_OK</div>} />
                                    <Route exact path='/' component={Home} />
                                    <Route exact path='/login' component={Login} />
                                    <Route path='/server/:id' component={ServerDetails} />
                                    <Route path='/server' component={ServersTable} />
                                    <Route path='/rolloutstatus' component={RolloutStatus} />
                                    <Route path='/patchgroups' component={PatchGroups} />
                                    <Route path='/patchgroup/:id' component={PatchGroupDetails} />
                                    <Route path='/service/:id' component={ServiceDetails} />
                                    <Route path='/virtualmachines' component={VirtualMachines} />
                                    <Route path={ROUTE_SERVERS} component={ServersContainer} />
                                    <Route path='/services' component={Services} />
                                    <Route path='/lbfarms' component={LoadBalancerFarms} />
                                    <Route path='/ipaddresses' component={IPAddresses} />
                                    <Route exact path='/statistics' component={Statistics} />
                                    <PrivateRoute isAdmin={isAdmin(this.props.baseStore.currentUser)} exact path='/admin' component={Admin} />
                                    <PrivateRoute isAdmin={isAdmin(this.props.baseStore.currentUser)} exact path='/admin/loadbalancer' component={LoadBalancersAdmin} />
                                    <PrivateRoute isAdmin={isAdmin(this.props.baseStore.currentUser)} exact path='/admin/activedirectory' component={ActiveDirectoryAdmin} />
                                    <PrivateRoute isAdmin={isAdmin(this.props.baseStore.currentUser)} exact path='/admin/agentlogs' component={AgentLogs} />
                                    <PrivateRoute isAdmin={isAdmin(this.props.baseStore.currentUser)} exact path={ROUTE_SERVERS_ADMIN} component={ServersContainer} />
                                    <Route path='/versionstatus' component={VersionStatus} />
                                    <Route path='/healthchecks' component={HealthChecks} />
                                    <Route path='/statistics/services' component={ServicesStatistics} />
                                    <Route path='/statistics/servers' component={ServersStatistics} />
                                    <Route path='/statistics/loadbalancerfarms' component={LoadBalancerFarmsStatistics} />
                                    <Route path='/statistics/servicevirtualmachines' component={ServiceVirtualMachine} />
                                    <Route component={NotFound} />
                                </Switch>
                            </ErrorBoundary>
                        </div>
                        <Footer id="footer" {...wideClass} />
                    </ScrollToTop>
                </BrowserRouter>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        baseStore: state.BaseReducer,
        headerStore: state.HeaderReducer,
        serviceStore: state.ServiceReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        authenticateAction: authenticateAction,
        authenticationStartedAction: authenticationStartedAction,
        authenticateEndedAction: authenticateEndedAction,
        authenticateOKAction: authenticateOKAction,
        authenticationFailedAction: authenticationFailedAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Base);
