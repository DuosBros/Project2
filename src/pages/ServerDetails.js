import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Segment, Divider, Icon, List, Image, Table, Button } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment'

import SimpleTable from '../components/SimpleTable';
import { getServerDetailsAction, getVmDetailsAction } from '../actions/ServerActions';
import { getServerDetails, getVmDetails } from '../requests/ServerAxios';

import { KIBANA_WINLOGBEAT_SERVER_URL, KIBANA_SERVER_URL_PLACEHOLDER, KIBANA_PERFCOUNTER_SERVER_URL, DISME_SERVICE_PLACEHOLDER, DISME_SERVICE_URL } from '../appConfig';
import { getServerState } from '../utils/HelperFunction';

import spinner from '../assets/Spinner.svg';
import SortableTable from '../components/SortableTable';

class ServerDetails extends React.Component {

    componentDidMount() {
        this.updateServer(this.props.match.params.id);
    }
    addEventListener
    updateServer(id) {
        getServerDetails(id)
            .then(res => {
                this.props.getServerDetailsAction(res.data)

                if (!_.isEmpty(res.data)) {
                    return getVmDetails(res.data.Id)
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
        var OSIcon, serverDetailsTempComponent, servicesTableRows, serviceTableColumnProperties, websitesTableRows, websitesTableColumnProperties, loadBalancerFarmsTableColumnProperties;

        console.log(serverDetails)
        if (!_.isEmpty(serverDetails)) {
            if (serverDetails.OperatingSystem.toLowerCase().indexOf("windows") >= 0) {
                OSIcon = (<Icon circular name='windows' />)
            }

            if (serverDetails.OperatingSystem.toLowerCase().indexOf("linux") >= 0) {
                OSIcon = (<Icon circular name='linux' />)
            }

            servicesTableRows = serverDetails.ServicesFull.map(service => {
                return (
                    <Table.Row key={service.Id}>
                        <Table.Cell >{service.Name}</Table.Cell>
                        {/* TODO: link this to service details */}
                        <Table.Cell >{service.Shortcut}</Table.Cell>
                        <Table.Cell>
                            <Button
                                onClick={() =>
                                    window.open(
                                        _.replace(DISME_SERVICE_URL, new RegExp(DISME_SERVICE_PLACEHOLDER, "g"),
                                            service.DismeID))}
                                style={{ padding: '0.3em' }}
                                size='medium'
                                icon='external' />
                        </Table.Cell>
                    </Table.Row>
                )
            })

            serviceTableColumnProperties = [
                {
                    name: "Name",
                    width: 3,
                },
                {
                    name: "Shortcut",
                    width: 3,
                },
                {
                    name: "Disme",
                    width: 1,
                }
            ];



            websitesTableRows = serverDetails.Websites.map(website => {
                return (
                    <Table.Row key={website.Id}>
                        <Table.Cell >{website.SiteName}</Table.Cell>
                        <Table.Cell >{website.Id}</Table.Cell>
                        <Table.Cell>
                            {website.AppPoolName}
                        </Table.Cell>
                        <Table.Cell >{website.Bindings.map(binding => {
                            return (
                                <span key={binding.Id}>{binding.IpAddress + ":" + binding.Port + ":" + binding.Binding} <br /></span>
                            )
                        })}</Table.Cell>
                    </Table.Row>
                )
            })

            websitesTableColumnProperties = [
                {
                    name: "Site Name",
                    width: 3,
                },
                {
                    name: "SiteId",
                    width: 1,
                },
                {
                    name: "AppPool Name",
                    width: 3,
                },
                {
                    name: "Bindings",
                    width: 4,
                }
            ];

            var ips = serverDetails.IPs.map(ip => {
                return (
                    <span key={ip.Id}>{ip.IpAddress} <br /></span>
                )
            })

            loadBalancerFarmsTableColumnProperties = [
                {
                    name: "Name",
                    width: 3,
                },
                {
                    name: "Pool",
                    width: 1,
                },
                {
                    name: "Port",
                    width: 3,
                },
                {
                    name: "IpAddress",
                    width: 2,
                },
                {
                    name: "LoadBalancer Farm",
                    width: 3,
                }
            ];

            var loadBalancerFarmsTableRows = serverDetails.LoadBalancerFarms.map(lbfarm => {
                return (
                    <Table.Row key={lbfarm.Id}>
                        <Table.Cell>{lbfarm.Name}</Table.Cell>
                        <Table.Cell>{lbfarm.Pool}</Table.Cell>
                        <Table.Cell>{lbfarm.Port}</Table.Cell>
                        <Table.Cell>{lbfarm.IpAddress}</Table.Cell>
                        <Table.Cell>{lbfarm.LbName}</Table.Cell>
                    </Table.Row>
                )
            })

            serverDetailsTempComponent = (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4' content='Server Info' />
                            <Segment attached>
                                <Grid columns={4}>
                                    <Grid.Row>
                                        <Grid.Column width={3}>
                                            <b>Server Name:</b>
                                            <br />
                                            <b>IP:</b>
                                        </Grid.Column>
                                        <Grid.Column width={5}>
                                            {serverDetails.ServerName}
                                            <br />
                                            {ips}
                                        </Grid.Column>
                                        <Divider vertical section />
                                        <Grid.Column width={3}>
                                            <b>Stage:</b>
                                            <br />
                                            <b>Environment:</b>
                                            <br />
                                            <b>Datacenter:</b>
                                            <br />
                                            <b>Country:</b>
                                        </Grid.Column>
                                        <Grid.Column width={5}>
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
                                        <Grid.Column width={3}>
                                            <b>FQDN:</b>
                                            <br />
                                            <b>Domain:</b>
                                        </Grid.Column>
                                        <Grid.Column width={5}>
                                            {serverDetails.FQDN}
                                            <br />
                                            {serverDetails.Domain}
                                        </Grid.Column>
                                        <Grid.Column width={3}><b>Kibana:</b></Grid.Column>
                                        <Grid.Column>
                                            <a target="_blank" rel="noopener noreferrer" href={_.replace(KIBANA_WINLOGBEAT_SERVER_URL, new RegExp(KIBANA_SERVER_URL_PLACEHOLDER, "g"), serverDetails.ServerName)}>Eventlog </a> <br />
                                            <a target="_blank" rel="noopener noreferrer" href={_.replace(KIBANA_PERFCOUNTER_SERVER_URL, new RegExp(KIBANA_SERVER_URL_PLACEHOLDER, "g"), serverDetails.ServerName)}>PerfCounter </a>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column width={3}>
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
                                        <Grid.Column width={5}>
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
                                        <Grid.Column width={3}>
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
                                        <Grid.Column width={5}>
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
                                <Grid stackable>
                                    <Grid.Row>
                                        <Grid.Column width={3}>
                                            <b>AD Path:</b>
                                        </Grid.Column>
                                        <Grid.Column width={14} style={{ fontSize: 'smaller' }} >
                                            {serverDetails.ADPath}
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                            <Header attached>
                                <List>
                                    <List.Item>
                                        <List.Content floated='left'>Last Update: {moment(serverDetails.LastUpdate).local().format("HH:mm:ss DD.MM.YYYY")} </List.Content>
                                        <List.Content floated='right'>Created: {moment(serverDetails.CreatedAt).local().format("HH:mm:ss DD.MM.YYYY")}</List.Content>
                                    </List.Item>
                                </List>
                            </Header>

                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns='equal'>
                        <Grid.Column>
                            <Header block attached='top' as='h4' content='Disme Services' />
                            <Segment attached='bottom'>
                                <SimpleTable columnProperties={serviceTableColumnProperties} body={servicesTableRows} />
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Header block attached='top' as='h4' content='Placeholder for another segment' />
                            <Segment attached='bottom'>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4' content='Websites' />
                            <Segment attached='bottom'>
                                <SimpleTable columnProperties={websitesTableColumnProperties} body={websitesTableRows} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4' content='LoadBalancer Farms' />
                            <Segment attached='bottom'>
                                <SortableTable data={serverDetails.LoadBalancerFarms} />
                                {/* <SimpleTable columnProperties={loadBalancerFarmsTableColumnProperties} body={loadBalancerFarmsTableRows} /> */}
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
        }
        else {
            serverDetailsTempComponent = (
                <div className="centered">
                    <Image src={spinner} />
                </div>
            )
        }

        return (
            <div>
                {serverDetailsTempComponent}
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
