import React from 'react';
import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import { APP_TITLE } from '../appConfig';
import ErrorMessage from '../components/ErrorMessage';
import ServersAdminTable from '../components/ServersAdminTable';

class ServersAdmin extends React.PureComponent {
    componentDidMount() {
        document.title = APP_TITLE + "Servers Admin"
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
                                <ErrorMessage handleRefresh={this.props.fetchServersAndHandleResult} error={this.props.servers.success} />
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
                            <ServersAdminTable
                                rowsPerPage={50}
                                data={this.props.servers.data}
                                compact="very"
                                handleDeleteServer={this.props.handleDeleteServer} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default ServersAdmin;