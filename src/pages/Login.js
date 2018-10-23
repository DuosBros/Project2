import React from 'react';
import { Button, Form, Grid, Message, Image, Segment } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            authExceptionMessage: "",
            authExceptionResponse: ""
        }

        this.props.history.push('/login')

        if (this.props.baseStore.authenticationDone && !this.props.baseStore.authenticationFailed) {
            this.props.history.push('/home')
        }
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
                        _.isEmpty(this.props.ex.authExceptionMessage) && _.isEmpty(this.props.ex.authExceptionResponse)
                            && _.isEmpty(this.state.authExceptionMessage) && _.isEmpty(this.state.authExceptionResponse) ? (<div></div>) : (
                                <Message error floating>
                                Failed to log in:
                                <br />
                                {this.props.ex.authExceptionMessage}
                                {this.props.ex.authExceptionResponse}
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
        // loginStartedAction: loginStartedAction,
        // loginEndedAction : loginEndedAction,
        // loginFailedAction : loginFailedAction,
        // loginSuccessAction : loginSuccessAction
    }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));