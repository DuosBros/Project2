import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import { getHealthChecks } from '../requests/HealthCheckAxios';
import { getHealthChecksAction } from '../actions/HealthCheckAction';
import ErrorMessage from '../components/ErrorMessage';
import HealthChecksTable from '../components/HealthChecksTable';
import { APP_TITLE } from '../appConfig';

class HealthChecks extends React.Component {

    componentDidMount() {
        this.fetchHealthCheckssAndHandleResult()

        document.title = APP_TITLE + "HealthChecks";
    }

    fetchHealthCheckssAndHandleResult = () => {
        getHealthChecks()
            .then(res => {
                this.props.getHealthChecksAction(
                    {
                        success: true,
                        data: res.data
                    })
            })
            .catch(err => {
                this.props.getHealthChecksAction({ success: false, error: err })
            })
    }

    render() {

        // in case of error
        if (!this.props.healthCheckStore.healthChecks.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                HealthChecks
                            </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.fetchHealthCheckssAndHandleResult} error={this.props.healthCheckStore.healthChecks.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.healthCheckStore.healthChecks.data)) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching healthchecks</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            )
        }

        // render page
        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            HealthChecks
                            </Header>
                        <Segment attached='bottom' >
                            <HealthChecksTable rowsPerPage={50} data={this.props.healthCheckStore.healthChecks.data} compact="very" />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

function mapStateToProps(state) {
    return {
        healthCheckStore: state.HealthCheckReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getHealthChecksAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HealthChecks);
