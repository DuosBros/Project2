import React from 'react';
import _ from 'lodash';

import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import ErrorMessage from '../components/ErrorMessage';
import HealthChecksTable from '../components/HealthChecksTable';
import { APP_TITLE } from '../appConfig';

class HealthChecks extends React.PureComponent {

    componentDidMount() {
        document.title = APP_TITLE + "HealthChecks";
    }

    render() {

        // in case of error
        if (!this.props.healthChecks.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                HealthChecks
                            </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.props.fetchHealthCheckssAndHandleResult} error={this.props.healthChecks.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.healthChecks.data)) {
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
                            <HealthChecksTable rowsPerPage={50} data={this.props.healthChecks.data} compact="very" />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default HealthChecks;
