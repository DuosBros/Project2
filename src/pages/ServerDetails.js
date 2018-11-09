import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Segment, Divider, Icon, List, Image, Table, Button } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment'

import SimpleTable from '../components/SimpleTable';
import { getServerDetailsAction, getVmDetailsAction, getServerScomAlertsAction } from '../actions/ServerActions';
import { getServerDetails, getVmDetails, getServerScomAlerts } from '../requests/ServerAxios';

import { KIBANA_WINLOGBEAT_SERVER_URL, KIBANA_SERVER_URL_PLACEHOLDER, KIBANA_PERFCOUNTER_SERVER_URL, DISME_SERVICE_PLACEHOLDER, DISME_SERVICE_URL, warningColor, errorColor } from '../appConfig';
import { getServerState } from '../utils/HelperFunction';

import spinner from '../assets/Spinner.svg';
import SortableTable from '../components/SortableTable';
import SCOMSegment from '../components/SCOMSegment';

class ServerDetails extends React.Component {

    componentDidMount() {
        this.updateServer(this.props.match.params.id);
    }

    updateServer(id) {
        getServerDetails(id)
            .then(res => {
                this.props.getServerDetailsAction(res.data)

                if (!_.isEmpty(res.data)) {
                    return getServerScomAlerts(res.data.ServerName)
                }
            })
            .catch(err => {
                return
            })
            .then(res => {
                if (!_.isEmpty(res)) {
                    console.log('scom:' + res.data)
                    this.props.getServerScomAlertsAction(res.data)
                }
                
                return getVmDetails(id)
            })
            .then((res) => {
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
        var scomAlerts = this.props.serverStore.scomAlerts;
        var OSIcon, serverDetailsTempComponent, servicesTableRows, serviceTableColumnProperties, websitesTableRows, websitesTableColumnProperties, windowsServicesTableColumnProperties,
        windowsServicesTableRows;
        
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

            windowsServicesTableColumnProperties = [
                {
                    name: "Service Name",
                    width: 3,
                },
                {
                    name: "Display Name",
                    width: 1,
                },
                {
                    name: "Startup Type",
                    width: 2,
                },
                {
                    name: "State",
                    width: 2,
                },
                {
                    name: "User",
                    width: 4,
                }
            ]

            windowsServicesTableRows = serverDetails.WindowsServices.map(service => {
                return (
                    <Table.Row key={service.Id}>
                        <Table.Cell >{service.ServiceName}</Table.Cell>
                        <Table.Cell >{service.DisplayName}</Table.Cell>
                        <Table.Cell>
                            {service.StartupType}
                        </Table.Cell>
                        <Table.Cell >{service.State}</Table.Cell>
                        <Table.Cell >{service.User}</Table.Cell>
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
                                        <Grid.Column width={14} style={{ wordWrap: 'break-word' }} >
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
                    <Grid.Row>
                        <Grid.Column width={6}>
                            <Header block attached='top' as='h4' content='Disme Services' />
                            <Header block attached='top' as='h4' floated="right" content='Disme Services' />
                            <Segment attached='bottom'>
                                <SimpleTable columnProperties={serviceTableColumnProperties} body={servicesTableRows} />
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Header 
                                block 
                                attached='top' 
                                as='h4'
                                style={scomAlerts.length > 0 ? {backgroundColor: errorColor} : {}}>
                            SCOM Alerts
                            {scomAlerts.length > 0 ? (<Icon name="warning" />) : (<span></span>)}
                            </Header>
                            <Segment attached='bottom'>
                                <SCOMSegment data={scomAlerts}/>
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
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4' content='Windows Services' />
                            <Segment attached='bottom'>
                                <SimpleTable columnProperties={windowsServicesTableColumnProperties} body={windowsServicesTableRows} />
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
        getVmDetailsAction,
        getServerScomAlertsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ServerDetails);
