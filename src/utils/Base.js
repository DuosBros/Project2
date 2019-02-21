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

import { authenticateAction, authenticationStartedAction, authenticateEndedAction, authenticateOKAction, authenticationFailedAction } from '../actions/BaseAction';
import { authenticate } from '../requests/BaseAxios';
import { debounce } from '../utils/HelperFunction';

import { LOCO_API } from '../appConfig';
import LoadBalancerFarmsTasks from '../modals/LoadBalancerFarmsTasks';
import ServersTable from '../components/ServersTable';
import PatchGroups from '../pages/PatchGroups';
import RolloutStatus from '../pages/RolloutStatus';
import VirtualMachines from '../pages/VirtualMachines';
import Servers from '../pages/Servers';
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
import LoadBalancerAdmin from '../pages/LoadBalancerAdmin';
import ScrollToTop from './ScrollToTop';

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

        return (
            <div>
                <BrowserRouter>
                    <ScrollToTop>
                        <Route path="/:entityType?/:entityId?" component={Header} />
                        <Sidebar />
                        <LoadBalancerFarmsTasks show={this.props.serviceStore.showLoadBalancerFarmsTasksModal} />
                        <UserDetails userDetails={this.props.baseStore.currentUser} show={this.props.headerStore.showUserDetails} />
                        <div id="bodyWrapper" {...wideClass}>
                            <ErrorBoundary>
                                <Switch>
                                    <Route exact path='/' component={Home} />
                                    <Route exact path='/login' component={Login} />
                                    <Route path='/server/:id' component={ServerDetails} />
                                    <Route path='/server' component={ServersTable} />
                                    <Route path='/rolloutstatus' component={RolloutStatus} />
                                    <Route path='/patchgroups' component={PatchGroups} />
                                    <Route path='/patchgroup/:id' component={PatchGroupDetails} />
                                    <Route path='/service/:id' component={ServiceDetails} />
                                    <Route path='/virtualmachines' component={VirtualMachines} />
                                    <Route path='/servers' component={Servers} />
                                    <Route path='/services' component={Services} />
                                    <Route path='/lbfarms' component={LoadBalancerFarms} />
                                    <Route path='/ipaddresses' component={IPAddresses} />
                                    <Route exact path='/statistics' component={Statistics} />
                                    <Route exact path='/admin' component={Admin} />
                                    <Route exact path='/admin/loadbalancer' component={LoadBalancerAdmin} />
                                    <Route path='/versionstatus' component={VersionStatus} />
                                    <Route path='/healthchecks' component={HealthChecks} />
                                    <Route path='/statistics/services' component={ServicesStatistics} />
                                    <Route path='/statistics/servers' component={ServersStatistics} />
                                    <Route path='/statistics/loadbalancerfarms' component={LoadBalancerFarmsStatistics} />
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
