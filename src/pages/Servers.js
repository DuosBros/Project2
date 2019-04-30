import React from 'react';

import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import ServersTable from '../components/ServersTable';
import ErrorMessage from '../components/ErrorMessage';
import { APP_TITLE } from '../appConfig';

export default class Servers extends React.Component {

    componentDidMount() {
        document.title = APP_TITLE + "Servers"
    }

    render() {

        // in case of error
        if (!this.props.servers.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Servers
                            </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.props.fetchServersAndHandleResult} error={this.props.servers.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (!this.props.servers.data) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching servers</Message.Header>
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
                            Servers
                            </Header>
                        <Segment attached='bottom' >
                            <ServersTable rowsPerPage={50} data={this.props.servers.data} compact="very" shouldIPColumnRender={false} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}
