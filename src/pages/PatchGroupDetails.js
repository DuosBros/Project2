import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import { getPatchGroupDetails, getPatchGroupServers } from '../requests/PatchGroupAxios';
import { getPatchGroupDetailsAction, getPatchGroupServersAction } from '../utils/actions';
import ErrorMessage from '../components/ErrorMessage';
import ServersTable from '../components/ServersTable';
import { getServerState, getDismeState } from '../utils/HelperFunction';
import { APP_TITLE } from '../appConfig';

class PatchGroupDetails extends React.Component {

    componentDidMount() {
        this.updatePatchGroupDetails();
    }

    updatePatchGroupDetails = () => {
        this.fetchPatchGroupDetailsAndHandleResult();
        this.fetchPatchGroupServersAndHandleResult();
    }

    fetchPatchGroupDetailsAndHandleResult = () => {
        var id = this.props.match.params.id;

        getPatchGroupDetails(id)
            .then(res => {
                this.props.getPatchGroupDetailsAction({ success: true, data: res.data })
                if(res.data[0]) {
                    document.title = APP_TITLE + res.data[0].Name;
                }
                else {
                    document.title = APP_TITLE + "PatchGroup Details"
                }
            })
            .catch(err => {
                this.props.getPatchGroupDetailsAction({ success: false, error: err })
            })


    }

    fetchPatchGroupServersAndHandleResult = () => {
        var id = this.props.match.params.id;
        getPatchGroupServers(id)
            .then(res => {
                this.props.getPatchGroupServersAction({
                    success: true, data: res.data.map(server => {
                        server.ServerState = getServerState(server.ServerStateID)
                        server.Disme = getDismeState(server.Disme)
                        return server
                    })
                })
            })
            .catch(err => {
                this.props.getPatchGroupServersAction({ success: false, error: err })
            })
    }


    render() {

        // in case of error
        if (!this.props.patchGroupStore.patchGroupDetails.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                PatchGroup Details
                            </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.fetchPatchGroupDetailsAndHandleResult} error={this.props.patchGroupStore.patchGroupDetails.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            );
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.patchGroupStore.patchGroupDetails.data)) {
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
        if (_.isEmpty(this.props.patchGroupStore.patchGroupServers.data)) {
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


        var patchGroupDetails = this.props.patchGroupStore.patchGroupDetails.data[0];

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
                                this.props.patchGroupStore.patchGroupServers.success ? (
                                    <ServersTable
                                        rowsPerPage={50}
                                        data={this.props.patchGroupStore.patchGroupServers.data}
                                        compact="very" />
                                ) : (
                                        <ErrorMessage
                                            handleRefresh={this.fetchPatchGroupServersAndHandleResult}
                                            error={this.props.patchGroupStore.patchGroupServers.error} />
                                    )
                            }
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

function mapStateToProps(state) {
    return {
        patchGroupStore: state.PatchGroupReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getPatchGroupServersAction,
        getPatchGroupDetailsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PatchGroupDetails);
