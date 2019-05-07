import React from 'react';
import _ from 'lodash';

import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import ErrorMessage from '../components/ErrorMessage';
import ServersTable from '../components/ServersTable';
import { APP_TITLE } from '../appConfig';

class PatchGroupDetails extends React.PureComponent {

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (this.props.patchGroupDetails.data) {
                document.title = APP_TITLE + this.props.patchGroupDetails.data[0].Name;
            }
            else {
                document.title = APP_TITLE + "PatchGroup Details"
            }
        }
    }

    render() {

        // in case of error
        if (!this.props.patchGroupDetails.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                PatchGroup Details
                            </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.props.updatePatchGroupDetails} error={this.props.patchGroupDetails.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            );
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.patchGroupDetails.data)) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching patch group details</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            )
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.patchGroupServers.data)) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching patch group servers</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            )
        }


        var patchGroupDetails = this.props.patchGroupDetails.data[0];

        // render page
        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            PatchGroup Details
                        </Header>
                        <Segment attached='bottom' >
                            <Grid stackable>
                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        <dl className="dl-horizontal">
                                            <dt>Name:</dt>
                                            <dd>{patchGroupDetails.Name}</dd>
                                            <dt>ADGroup Name:</dt>
                                            <dd>{patchGroupDetails.ADGroupName}</dd>
                                            <dt>AD Path:</dt>
                                            <dd>{patchGroupDetails.ADPATH}</dd>
                                            <dt>Country:</dt>
                                            <dd>{patchGroupDetails.Country}</dd>
                                            <dt>Stage:</dt>
                                            <dd>{patchGroupDetails.Stage}</dd>
                                            <dt>MemberOfGroup:</dt>
                                            <dd>{patchGroupDetails.MemberOfGroup}</dd>
                                        </dl>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            PatchGroup Servers
                        </Header>
                        <Segment attached='bottom' >
                            {
                                this.props.patchGroupServers.success ? (
                                    <ServersTable
                                        rowsPerPage={50}
                                        data={this.props.patchGroupServers.data}
                                        compact="very" />
                                ) : (
                                        <ErrorMessage
                                            handleRefresh={this.fetchPatchGroupServersAndHandleResult}
                                            error={this.props.patchGroupServers.error} />
                                    )
                            }
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default PatchGroupDetails;
