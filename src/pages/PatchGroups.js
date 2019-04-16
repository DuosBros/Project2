import React from 'react';
import _ from 'lodash';

import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import PatchGroupsTable from '../components/PatchGroupsTable';
import ErrorMessage from '../components/ErrorMessage';
import { APP_TITLE } from '../appConfig';

class PatchGroups extends React.Component {

    componentDidMount() {
        document.title = APP_TITLE + "Patchgroups"
    }

    render() {

        // in case of error
        if (!this.props.patchGroups.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Patch groups
                        </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.props.fetchPatchGroupsAndHandleResult} error={this.props.patchGroupStore.patchGroups.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.patchGroups.data)) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching patch groups</Message.Header>
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
                            Patch groups
                        </Header>
                        <Segment attached='bottom' >
                            <PatchGroupsTable compact="very" rowsPerPage={45} data={this.props.patchGroups.data} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default PatchGroups;
