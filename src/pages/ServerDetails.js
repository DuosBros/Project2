import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Segment, Divider, Icon, List } from 'semantic-ui-react';
import _ from 'lodash';

import { getServerDetailsAction, getVmDetailsAction } from '../actions/ServerActions';
import { getServerDetails, getVmDetails } from '../requests/ServerAxios';

import { KIBANA_WINLOGBEAT_SERVER_URL, KIBANA_SERVER_URL_PLACEHOLDER, KIBANA_PERFCOUNTER_SERVER_URL } from '../appConfig';
import { getServerState } from '../utils/HelperFunction';

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

        var serverDetails = this.props.serverStore.serverDetails;
        var OSIcon

        if (!_.isEmpty(serverDetails.OperatingSystem)) {
            if (serverDetails.OperatingSystem.toLowerCase().indexOf("windows") >= 0) {
                OSIcon = (<Icon circular name='windows' />)
            }

            if (serverDetails.OperatingSystem.toLowerCase().indexOf("linux") >= 0) {
                OSIcon = (<Icon circular name='linux' />)
            }
        }

        console.log(serverDetails)
        return (
            <div>
                <Grid stackable>
                    <Grid.Column>
                        <Header block attached='top' as='h4' content='Server Info' />
                        <Segment attached>
                            <Grid columns={4}>
                                <Grid.Row>
                                    <Grid.Column width={2}><b>Server Name:</b></Grid.Column>
                                    <Grid.Column width={6}>
                                        {serverDetails.ServerName}
                                    </Grid.Column>
                                    <Divider vertical section />
                                    <Grid.Column width={2}>
                                        <b>Stage:</b>
                                        <br />
                                        <b>Environment:</b>
                                        <br />
                                        <b>Datacenter:</b>
                                        <br />
                                        <b>Country:</b>
                                    </Grid.Column>
                                    <Grid.Column width={6}>
                                        {serverDetails.Stage}
                                        <br />
                                        {serverDetails.Environment}
                                        <br />
                                        {serverDetails.DataCenter}
                                        <br />
                                        {serverDetails.CountryName}
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={2}>
                                        <b>FQDN:</b>
                                        <br />
                                        <b>Domain:</b>
                                    </Grid.Column>
                                    <Grid.Column width={6}>
                                        {serverDetails.FQDN}
                                        <br />
                                        {serverDetails.Domain}
                                    </Grid.Column>
                                    <Grid.Column width={2}><b>Kibana:</b></Grid.Column>
                                    <Grid.Column>
                                        <a target="_blank" rel="noopener noreferrer" href={_.replace(KIBANA_WINLOGBEAT_SERVER_URL, new RegExp(KIBANA_SERVER_URL_PLACEHOLDER, "g"), serverDetails.ServerName)}>Eventlog </a> <br />
                                        <a target="_blank" rel="noopener noreferrer" href={_.replace(KIBANA_PERFCOUNTER_SERVER_URL, new RegExp(KIBANA_SERVER_URL_PLACEHOLDER, "g"), serverDetails.ServerName)}>PerfCounter </a>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={2}>
                                        <b>OS:</b>
                                        <br />
                                        <b>Server Owner:</b>
                                        <br />
                                        <b>PatchGroup:</b>
                                        <br />
                                        <b>State:</b>
                                        <br />
                                        <b>Disme:</b>
                                    </Grid.Column>
                                    <Grid.Column width={6}>
                                        {OSIcon}
                                        {serverDetails.OperatingSystem}
                                        <br />
                                        {serverDetails.ServerOwner}
                                        <br />
                                        {serverDetails.PatchGroupName ? (serverDetails.PatchGroupName) : ('Exclude ') + serverDetails.PatchID}
                                        <br />
                                        {getServerState(serverDetails.ServerStateID)}
                                        <br />
                                        {serverDetails.Disme ? 'active' : 'not active'}
                                    </Grid.Column>
                                    <Grid.Column width={2}>
                                        <b>Cloud:</b>
                                        <br />
                                        <b>CPU:</b>
                                        <br />
                                        <b>Memory:</b>
                                        <br />
                                        <b>Network:</b>
                                        <br />
                                        <b>Availability Set:</b>
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
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={2}>
                                        <b>AD Path:</b>
                                    </Grid.Column>
                                    <Grid.Column width={14}>
                                        {serverDetails.ADPath}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                        <Header attached>
                            <List>
                                <List.Item>
                                    <List.Content floated='left'>Last Update: </List.Content>
                                    <List.Content floated='right'>Created: </List.Content>
                                </List.Item>
                            </List>
                        </Header>

                        <Header block attached='top' as='h4' content='Disme Services' />
                        <Segment attached='bottom'>
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
