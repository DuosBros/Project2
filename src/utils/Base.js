import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Image, Icon, Message } from 'semantic-ui-react';

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
import spinner from '../assets/Spinner.svg';
import { debounce } from '../utils/HelperFunction';

import { LOCO_API } from '../appConfig';
import NotAuthorized from '../modals/NotAuthorized';
import LoadBalancerFarmsTasks from '../modals/LoadBalancerFarmsTasks';
import ServerBuffedTable from '../components/ServerBuffedTable';

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
    };

    render() {

        // will use this, do not remove
        const isMobile = this.state.width <= 766;

        if (!this.props.baseStore.authenticationDone) {
            return (
                <div className="centered">
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
                    <div>
                        <Route path="/:entityType?/:entityId?" component={Header} />
                        <Sidebar />
                        <LoadBalancerFarmsTasks show={this.props.serviceStore.showLoadBalancerFarmsTasksModal} />
                        <UserDetails userDetails={this.props.baseStore.currentUser} show={this.props.headerStore.showUserDetails} />
                        {/* <NotAuthorized userDetails={this.props.baseStore.currentUser} show={this.props.baseStore.showNotAuthorizedModal} /> */}
                        <div id="bodyWrapper" {...wideClass}>
                            <Switch>
                                <Route exact path='/' component={Home} />
                                <Route exact path='/login' component={Login} />
                                <Route path='/server/:id' component={ServerDetails} />
                                <Route path='/server' component={ServerBuffedTable} />
                                <Route path='/service/:id' component={ServiceDetails} />
                            </Switch>
                        </div>
                        <Footer id="footer" {...wideClass} />
                    </div>
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
