import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Segment, List, Icon } from 'semantic-ui-react';

import { getServerDetailsAction } from '../actions/ServerActions';
import { getServerDetails } from '../requests/ServerAxios';

class ServerDetails extends React.Component {

    componentDidMount() {
        this.updateServer(this.props.match.params.id);
    }

    updateServer(id) {
        getServerDetails(id)
            .then(res => {
                this.props.getServerDetailsAction(res.data)
            });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.match && this.props.match.params) {
            const params = this.props.match.params;
            if (params.id && params.id !== prevProps.match.params.id) {
                this.updateServer(this.props.match.params.id);
            }
        }
    }

    render() {
        console.log(this.props.serverStore.serverDetails)

        var serverDetails = this.props.serverStore.serverDetails;

        return (
            <div>
                <Grid stackable>
                    <Grid.Column>
                        <Header block attached='top' as='h4' content='Server Info' />
                        <Segment attached='bottom'>
                            <Grid columns={4}>
                                <Grid.Row>
                                    <Grid.Column>Server Name:</Grid.Column>
                                    <Grid.Column>
                                        {this.props.serverStore.serverDetails.ServerName}
                                    </Grid.Column>
                                    <Grid.Column>
                                        Stage:
                                        <br />
                                        Environment:
                                        <br />
                                        Datacenter:
                                        <br />
                                        Country:
                                    </Grid.Column>
                                    <Grid.Column>
                                        {this.props.serverStore.serverDetails.Stage}
                                        <br />
                                        {this.props.serverStore.serverDetails.Environment}
                                        <br />
                                        {this.props.serverStore.serverDetails.DataCenter}
                                        <br />
                                        {this.props.serverStore.serverDetails.CountryName}
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        FQDN:
                                        <br />
                                        Domain:
                                    </Grid.Column>
                                    <Grid.Column>
                                        {this.props.serverStore.serverDetails.FQDN}
                                        <br />
                                        {this.props.serverStore.serverDetails.Domain}
                                    </Grid.Column>
                                    <Grid.Column>Kibana:</Grid.Column>
                                    <Grid.Column>kibana link</Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        Operating System:
                                        <br />
                                        Server Owner:
                                        <br />
                                        PatchGroup:
                                        <br />
                                        State:
                                        <br />
                                        Disme:
                                    </Grid.Column>
                                    <Grid.Column>
                                        {this.props.serverStore.serverDetails.OperatingSystem}
                                        <br />
                                        {this.props.serverStore.serverDetails.ServerOwner}
                                        <br />
                                        {this.props.serverStore.serverDetails.PatchGroupName ? (this.props.serverStore.serverDetails.PatchGroupName) : ('Exclude ') + this.props.serverStore.serverDetails.PatchID}
                                        <br />
                                        {this.props.serverStore.serverDetails.State ? 'active' : 'not active'}
                                        <br />
                                        {this.props.serverStore.serverDetails.Disme}
                                    </Grid.Column>
                                    <Grid.Column>
                                        VM:
                                        <br />
                                        Cloud:
                                        <br />
                                        CPU:
                                        <br />
                                        Memory:
                                        <br />
                                        Network:
                                        <br />
                                        Availability Set:
                                    </Grid.Column>
                                    <Grid.Column>
                                        {this.props.serverStore.serverDetails.OperatingSystem}
                                        <br />
                                        {this.props.serverStore.serverDetails.ServerOwner}
                                        <br />
                                        {this.props.serverStore.serverDetails.PatchGroupName ? (this.props.serverStore.serverDetails.PatchGroupName) : ('Exclude ') + this.props.serverStore.serverDetails.PatchID}
                                        <br />
                                        {this.props.serverStore.serverDetails.State ? 'active' : 'not active'}
                                        <br />
                                        {this.props.serverStore.serverDetails.Disme}
                                        <br />
                                        {this.props.serverStore.serverDetails.State ? 'active' : 'not active'}
                                    </Grid.Column>
                                </Grid.Row>

                            </Grid>

                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        serverStore: state.ServerReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getServerDetailsAction: getServerDetailsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ServerDetails);
