import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';
import { Image } from 'semantic-ui-react';

import Header from './Header';
import Footer from './Footer';
import Home from '../pages/Home';
import ServerDetails from '../pages/ServerDetails';
import ServiceDetails from '../pages/ServiceDetails';
import Login from '../pages/Login';

import { authenticateAction, authenticationStartedAction, authenticateEndedAction, authenticateOKAction, authenticationFailedAction } from '../actions/BaseAction';
import { authenticate } from '../requests/BaseAxios';
import spinner from '../assets/Spinner.svg';

class Base extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            authExceptionMessage: "",
            authExceptionResponse: ""
        }

        props.authenticationStartedAction();

        authenticate()
            .then(res => {
                this.props.authenticateAction(res.data)
                this.props.authenticateEndedAction();
                this.props.authenticateOKAction();
            })
            .catch((err) => {
                this.setState({ authExceptionMessage: err.message ? err.message : '', authExceptionResponse: err.response ? err.response : '' })

                this.props.authenticationFailedAction();
                this.props.authenticateEndedAction();
            })
    }
    render() {
        return (
            <div>
                {
                    this.props.baseStore.authenticationDone ? (
                        this.props.baseStore.authenticationFailed ? (
                            <Login ex={this.state} />
                        ) : (
                                <div>
                                    <BrowserRouter>
                                        <div >
                                            <div id={this.props.headerStore.showVerticalMenu ? "contentWrapper" : "extendedContentWrapper"}>
                                                <Header />
                                                <Switch>
                                                    <Route exact path='/' component={Home} />
                                                    <Route exact path='/login' component={Login} />
                                                    <Route path='/server/details/:id' render={(props) => (
                                                        <ServerDetails key={props.match.params.id} {...props} />)
                                                    } />
                                                    <Route path='/service/details/:id' render={(props) => (
                                                        <ServiceDetails key={props.match.params.id} {...props} />)
                                                    } />
                                                </Switch>
                                                <Footer id="footer" />
                                            </div>

                                        </div>
                                    </BrowserRouter>
                                </div>
                            )
                    ) : (
                            <div className="centered">
                                <Image src={spinner} />
                            </div>
                        )
                }

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        baseStore: state.BaseReducer,
        headerStore: state.HeaderReducer
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