import React from 'react';
import { Button, Form, Grid, Message, Segment } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

import { sendAuthenticationData } from '../requests/LoginAxios';
import { authenticateAction, authenticationStartedAction, authenticateEndedAction, authenticateOKAction, authenticationFailedAction } from '../actions/BaseAction';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            authExceptionMessage: this.props.ex ? this.props.ex.authExceptionMessage : "",
            authExceptionResponse: this.props.ex ? this.props.ex.authExceptionResponse : ""
        }

        this.props.history.push('/login')

        if (this.props.baseStore.authenticationDone && !this.props.baseStore.authenticationFailed) {
            this.props.history.push('/')
        }
    }

    auth = () => {

        this.props.authenticationStartedAction();

        var payload = {}

        if (!this.state.username.startsWith("ICEPOR\\")) {
            payload.Identity = "ICEPOR\\" + this.state.username
        }
        else {
            payload.Identity = this.state.username;
        }

        payload.Password = btoa(this.state.password);

        sendAuthenticationData(payload)
            .then(res => {
                this.props.authenticateAction(res.data)
                this.props.authenticateEndedAction();
                this.props.authenticateOKAction();

                this.props.history.push('/')
            })
            .catch((err) => {
                this.setState({ authExceptionMessage: err.message ? err.message : '', authExceptionResponse: err.response ? err.response : '' })

                this.props.authenticationFailedAction();
                this.props.authenticateEndedAction();
            })
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    render() {
        return (
            <Grid columns={3} stackable>
                <Grid.Column width='4'></Grid.Column>
                <Grid.Column width='8'>
                    {
                        _.isEmpty(this.props.ex)
                            && _.isEmpty(this.state.authExceptionMessage) && _.isEmpty(this.state.authExceptionResponse) ? (<div></div>) : (
                                <Message error floating>
                                    Failed to log in:
                                <br />
                                    {this.state.authExceptionMessage}
                                    {this.state.authExceptionResponse}
                                    <br />
                                    <br />
                                    Issues with logging in? Contact
                                <a href="mailto:SportsB2CLeanOpsLOB2C1@bwinparty.com" >  VIE LeanOps </a>
                                </Message>)

                    }

                    {/* <Image fluid src={logo} /> */}
                    <Form loading={!this.props.baseStore.authenticationDone} size='large'>
                        <Segment raised stacked>
                            <Form.Input fluid icon='user' iconPosition='left' placeholder='ICEPOR\username' name='username' onChange={this.handleChange} />
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='password'
                                type='password'
                                name='password'
                                onChange={this.handleChange} />
                            <Button
                                onClick={() => this.auth()}
                                style={{ backgroundColor: '#006bab' }}
                                primary
                                fluid
                                size='large'
                            >
                                Login
                                    </Button>
                        </Segment>
                    </Form>
                </Grid.Column>
                <Grid.Column width='4'></Grid.Column>
            </Grid>
        )
    }
}

function mapStateToProps(state) {
    return {
        baseStore: state.BaseReducer
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
