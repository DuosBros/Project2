import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Segment, Divider, Icon, List, Image, Table, Button } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment'

import SimpleTable from '../components/SimpleTable';
import ServerStatus from '../components/ServerStatus';

import { getServerDetailsAction, getVmDetailsAction, getServerScomAlertsAction } from '../actions/ServerActions';
import { getServerDetails, getServerScomAlerts } from '../requests/ServerAxios';

import { KIBANA_WINLOGBEAT_SERVER_URL, KIBANA_SERVER_URL_PLACEHOLDER, KIBANA_PERFCOUNTER_SERVER_URL, DISME_SERVICE_PLACEHOLDER, DISME_SERVICE_URL, errorColor } from '../appConfig';

import spinner from '../assets/Spinner.svg';
import BuffedTable from '../components/BuffedTable';
import SCOMSegment from '../components/SCOMSegment';
import DismeStatus from '../components/DismeStatus';

class ServerDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            websites: true,
            dismeservices: true,
            scomalerts: this.props.serverStore.scomAlerts > 0 ? true : false,
            loadbalancerfarms: true,
            windowsservices: true,
            webchecks: true,
            showAllSegments: true
        }
    }
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
                    this.props.getServerScomAlertsAction(res.data)
                }
            })
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.match && this.props.match.params) {
            const params = this.props.match.params;
            if (params.id && params.id !== prevProps.match.params.id) {
                this.updateServer(this.props.match.params.id);
            }
        }
    }

    handleToggleShowingContent = (segment) => {
        this.setState({ [segment]: !this.state[segment] });
    }

    handleToggleShowAllSegments = () => {

        if (this.state.showAllSegments && (this.state.scomalerts || this.state.webchecks || this.state.dismeservices || this.state.loadbalancerfarms || this.state.windowsservices || this.state.websites)) {
            this.setState({
                showAllSegments: false,
                websites: false,
                dismeservices: false,
                scomalerts: false,
                loadbalancerfarms: false,
                windowsservices: false,
                webchecks: false
            });
        }
        else {
            this.setState({
                showAllSegments: true,
                websites: true,
                dismeservices: true,
                scomalerts: true,
                loadbalancerfarms: true,
                windowsservices: true,
                webchecks: true
            });
        }
    }

    render() {
        var serverDetails = this.props.serverStore.serverDetails;
        var scomAlerts = this.props.serverStore.scomAlerts;
        var OSIcon, serverDetailsBody, servicesTableRows, serviceTableColumnProperties, websitesTableRows, websitesTableColumnProperties, windowsServicesTableColumnProperties,
            windowsServicesTableRows, webChecksTableColumnProperties, webChecksTableRows, lbfarmColumnPropertis;

        const { showAllSegments, webchecks, dismeservices, loadbalancerfarms, windowsservices, websites, scomalerts } = this.state;

        console.log(serverDetails)
        if (!_.isEmpty(serverDetails)) {

            if (!_.isEmpty(serverDetails.OperatingSystem)) {
                if (serverDetails.OperatingSystem.search(new RegExp("windows", "i")) >= 0) {
                    OSIcon = (<Icon circular name='windows' />)
                }

                if (serverDetails.OperatingSystem.search(new RegExp("linux", "i")) >= 0) {
                    OSIcon = (<Icon circular name='linux' />)
                }
            }

            lbfarmColumnPropertis = [
                {
                    name: "name",
                    displayName: "Name",
                    width: 4,
                },
                {
                    name: "pool",
                    displayName: "Pool",
                    width: 4,
                },
                {
                    name: "port",
                    displayName: "Port",
                    width: 1,
                },
                {
                    name: "ipaddress",
                    displayName: "IpAddress",
                    width: 3,
                },
                {
                    name: "lbname",
                    displayName: "LoadBalancer Name",
                    width: 4,
                }
            ]

            webChecksTableColumnProperties = [
                {
                    name: "Name",
                    width: 4,
                },
                {
                    name: "Url",
                    width: 8,
                },
                {
                    name: "Expected Text",
                    width: 3,
                },
                {
                    name: "KB article",
                    width: 1,
                }
            ];

            webChecksTableRows = serverDetails.WebChecks.map(webcheck => {
                return (
                    <Table.Row key={webcheck.Id}>
                        <Table.Cell >{webcheck.Title}</Table.Cell>
                        <Table.Cell >{webcheck.Url}</Table.Cell>
                        <Table.Cell >{webcheck.ExpectedText}</Table.Cell>
                        <Table.Cell>
                            <Button
                                onClick={() =>
                                    window.open(webcheck.Knowledgebasearticle)}
                                style={{ padding: '0.3em' }}
                                size='medium'
                                icon='external' />
                        </Table.Cell>
                    </Table.Row>
                )
            })

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
            
            serverDetailsBody = (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Server Info
                                <Button
                                    floated='right'
                                    onClick={() => this.handleToggleShowAllSegments()}
                                    content={showAllSegments && (scomalerts || webchecks || dismeservices || loadbalancerfarms || windowsservices || websites)  ? 'Hide All Segments' : 'Show All Segments'}
                                    icon='content'
                                    labelPosition='right'
                                    style={{ fontSize: 'medium', padding: '0.3em', bottom: '0.1em' }} />
                            </Header>
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
                                            {/* {serverStatusComponent} */}
                                            <ServerStatus serverStateId={serverDetails.ServerStateID} />
                                            <br />
                                            <DismeStatus dismeStatus={serverDetails.Disme} />
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
                                            {serverDetails.VM ? serverDetails.VM.Cloud : ""}
                                            <br />
                                            {serverDetails.VM ? serverDetails.VM.CPUCount : ""}
                                            <br />
                                            {serverDetails.VM ? serverDetails.VM.Memory : ""}
                                            <br />
                                            {serverDetails.VM ? serverDetails.VM.VMNetwork : ""}
                                            <br />
                                            {serverDetails.VM ? serverDetails.VM.AvailabilitySet : ""}
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
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                WebChecks
                                <Button onClick={() => this.handleToggleShowingContent("webchecks")} floated='right' icon='content' />
                            </Header>
                            {
                                webchecks ? (
                                    <Segment attached='bottom'>
                                        <SimpleTable columnProperties={webChecksTableColumnProperties} body={webChecksTableRows} />
                                    </Segment>
                                ) : (
                                        <div></div>
                                    )
                            }
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={scomAlerts.length > 0 ? 6 : 11}>
                            <Header block attached='top' as='h4'>
                                Disme Services
                                <Button onClick={() => this.handleToggleShowingContent("dismeservices")} floated='right' icon='content' />
                            </Header>
                            {
                                dismeservices ? (
                                    <Segment attached='bottom'>
                                        <SimpleTable columnProperties={serviceTableColumnProperties} body={servicesTableRows} />
                                    </Segment>
                                ) : (
                                        <div></div>
                                    )
                            }
                        </Grid.Column>
                        {scomAlerts.length > 0 ? (
                            <Grid.Column width={10}>
                                <Header
                                    block
                                    attached='top'
                                    as='h4'
                                    style={{ backgroundColor: errorColor }}>
                                    SCOM Alerts
                                    <Button onClick={() => this.handleToggleShowingContent("scomalerts")} floated='right' icon='content' />
                                </Header>
                                <Segment attached='bottom'>
                                    <SCOMSegment data={scomAlerts} />
                                </Segment>
                            </Grid.Column>
                        ) : (
                                <Grid.Column width={5}>
                                    <Header block attached='top' as='h4'>
                                        SCOM Alerts
                                    </Header>
                                </Grid.Column>
                            )}


                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Websites
                                <Button onClick={() => this.handleToggleShowingContent("websites")} floated='right' icon='content' />
                            </Header>
                            {
                                websites ? (
                                    <Segment attached='bottom'>
                                        <SimpleTable columnProperties={websitesTableColumnProperties} body={websitesTableRows} />
                                    </Segment>
                                ) : (
                                        <div></div>
                                    )
                            }

                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                LoadBalancer Farms
                                <Button onClick={() => this.handleToggleShowingContent("loadbalancerfarms")} floated='right' icon='content' />
                            </Header>
                            {
                                loadbalancerfarms ? (
                                    <Segment attached='bottom'>
                                        <BuffedTable data={serverDetails} />
                                    </Segment>
                                ) : (
                                        <div></div>
                                    )
                            }

                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Windows Services
                                <Button onClick={() => this.handleToggleShowingContent("windowsservices")} floated='right' icon='content' />
                            </Header>
                            {
                                windowsservices ? (
                                    <Segment attached='bottom'>
                                        <SimpleTable columnProperties={windowsServicesTableColumnProperties} body={windowsServicesTableRows} />
                                    </Segment>
                                ) : (
                                        <div></div>
                                    )
                            }

                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
        }
        else {
            serverDetailsBody = (
                <div className="centered">
                    <Image src={spinner} />
                </div>
            )
        }

        return (
            <div>
                {serverDetailsBody}
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
