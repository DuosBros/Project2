import React from 'react';
import _ from 'lodash';

import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import ServiceTable from '../components/ServiceTable';
import ErrorMessage from '../components/ErrorMessage';
import { APP_TITLE } from '../appConfig';

class Services extends React.Component {

    componentDidMount() {
        document.title = APP_TITLE + "Services"
    }

    render() {

        // in case of error
        if (!this.props.services.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Services
                            </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.props.fetchServicesAndHandleResult} error={this.props.services.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            );
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.services.data)) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching services</Message.Header>
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
                            Services
                            </Header>
                        <Segment attached='bottom' >
                            <ServiceTable rowsPerPage={50} data={this.props.services.data} compact="very" />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default Services;
