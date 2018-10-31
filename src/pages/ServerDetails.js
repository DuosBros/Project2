import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Segment, Divider, Icon } from 'semantic-ui-react';

import { getServerDetailsAction, getVmDetailsAction } from '../actions/ServerActions';
import { getServerDetails, getVmDetails } from '../requests/ServerAxios';

class ServerDetails extends React.Component {

    componentDidMount() {
        this.updateServer(this.props.match.params.id);
    }

    updateServer(id) {
        getServerDetails(id)
            .then(res => {
                this.props.getServerDetailsAction(res.data)
                if (res.data.length > 0) {
                    return getVmDetails(res.data[0].Id)
                }

            })
            .then(res => {
                this.props.getVmDetailsAction(res.data)
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
        console.log(this.props.serverStore.vmDetails)

        var serverDetails = this.props.serverStore.serverDetails;

        return (
            <div>
                <Grid stackable>
                    <Grid.Column>
                        <Header block attached='top' as='h4' content='Server Info' />
                        <Segment attached='bottom'>
                            <Grid columns={4}>
                                <Grid.Row>
                                    <Grid.Column width={2}><b>Server Name:</b></Grid.Column>
                                    <Grid.Column width={6}>
                                        {this.props.serverStore.serverDetails.ServerName}
                                    </Grid.Column>
                                    <Divider vertical section />
                                    <Grid.Column width={2}>
                                        Stage:
                                        <br />
                                        Environment:
                                        <br />
                                        Datacenter:
                                        <br />
                                        Country:
                                    </Grid.Column>
                                    <Grid.Column width={6}>
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
                                    <Grid.Column width={2}>
                                        FQDN:
                                        <br />
                                        Domain:
                                    </Grid.Column>
                                    <Grid.Column width={6}>
                                        {this.props.serverStore.serverDetails.FQDN}
                                        <br />
                                        {this.props.serverStore.serverDetails.Domain}
                                    </Grid.Column>
                                    <Grid.Column width={2}>Kibana:</Grid.Column>
                                    <Grid.Column>kibana link</Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={2}>
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
                                    <Grid.Column width={6}>
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
                                    <Grid.Column width={2}>
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
                                    <Grid.Column width={6}>
                                        {this.props.serverStore.vmDetails.Cloud}
                                        <br />
                                        {this.props.serverStore.vmDetails.CPUCount}
                                        <br />
                                        {this.props.serverStore.vmDetails.Memory}
                                        <br />
                                        {this.props.serverStore.vmDetails.VMNetwork}
                                        <br />
                                        {this.props.serverStore.vmDetails.AvailabilitySet}
                                    </Grid.Column>
                                </Grid.Row>

                            </Grid>
                            <Grid container>
                                <Grid.Row columns={2}>
                                    <Grid.Column width={2}>
                                        AD Path:
                                    </Grid.Column>
                                    <Grid.Column width={14}>
                                        {this.props.serverStore.serverDetails.ADPath}
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
        getServerDetailsAction,
        getVmDetailsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ServerDetails);
