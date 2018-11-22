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
import LoadBalancerFarmsBuffedTable from '../components/LoadBalancerFarmsBuffedTable';
import SCOMSegment from '../components/SCOMSegment';
import DismeStatus from '../components/DismeStatus';
import { Link } from 'react-router-dom';

class ServerDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            websites: true,
            dismeservices: true,
            scomalerts: this.props.serverStore.scomAlerts.length > 0 ? true : false,
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
        var visible = !(this.state.showAllSegments && (this.state.scomalerts || this.state.webchecks || this.state.dismeservices || this.state.loadbalancerfarms || this.state.windowsservices || this.state.websites));
        this.setState({
            showAllSegments: visible,
            websites: visible,
            dismeservices: visible,
            scomalerts: visible,
            loadbalancerfarms: visible,
            windowsservices: visible,
            webchecks: visible
        });
    }

    render() {
        var serverDetails = this.props.serverStore.serverDetails;
        var scomAlerts = this.props.serverStore.scomAlerts;
        var OSIcon, serverDetailsBody, servicesTableRows, serviceTableColumnProperties, websitesTableRows, websitesTableColumnProperties, windowsServicesTableColumnProperties,
            windowsServicesTableRows, webChecksTableColumnProperties, webChecksTableRows;

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
                        <Table.Cell ><a href={webcheck.Url} target="_blank">{webcheck.Url}</a></Table.Cell>
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
                        <Table.Cell>{service.Name}</Table.Cell>
                        <Table.Cell>
                            <Link to={'/service/' + service.Id} target="_blank">{service.Shortcut}</Link>
                        </Table.Cell>
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
                                Server Info - {serverDetails.ServerName}
                                <Button
                                    floated='right'
                                    onClick={() => this.handleToggleShowAllSegments()}
                                    content={(scomalerts || webchecks || dismeservices || loadbalancerfarms || windowsservices || websites) ? 'Hide All Segments' : 'Show All Segments'}
                                    icon='content'
                                    labelPosition='right'
                                    style={{ fontSize: 'medium', padding: '0.3em', bottom: '0.1em' }} />
                            </Header>
                            <Segment attached>
                                <Grid stackable>
                                    <Grid.Row>
                                        <Grid.Column width={8}>
                                            <dl class="dl-horizontal">
                                                <dt>Server Name:</dt>
                                                <dd>{serverDetails.ServerName}</dd>
                                            </dl>
                                            <dl class="dl-horizontal">
                                                <dt>IP:</dt>
                                                <dd>{ips}</dd>
                                            </dl>

                                            <dl class="dl-horizontal">
                                                <dt>Stage:</dt>
                                                <dd>{serverDetails.Stage}</dd>
                                                <dt>Environment:</dt>
                                                <dd>{serverDetails.Environment}</dd>
                                                <dt>Datacenter:</dt>
                                                <dd>{serverDetails.DataCenter}</dd>
                                                <dt>Country:</dt>
                                                <dd>{serverDetails.CountryName}</dd>
                                            </dl>

                                            <dl class="dl-horizontal">
                                                <dt>FQDN:</dt>
                                                <dd>{serverDetails.FQDN}</dd>
                                                <dt>Domain:</dt>
                                                <dd>{serverDetails.Domain}</dd>
                                            </dl>

                                            <dl class="dl-horizontal">
                                                <dt>OS:</dt>
                                                <dd>{OSIcon} {serverDetails.OperatingSystem}</dd>
                                            </dl>
                                        </Grid.Column>
                                        <Grid.Column width={8}>
                                            <dl class="dl-horizontal">
                                                <dt>Server Owner:</dt>
                                                <dd>{serverDetails.ServerOwner}</dd>
                                                <dt>PatchGroup:</dt>
                                                <dd>{serverDetails.PatchGroupName ? (serverDetails.PatchGroupName) : ('Exclude ') + serverDetails.PatchID}</dd>
                                                <dt>State:</dt>
                                                <dd><ServerStatus serverState={serverDetails.ServerState} /></dd>
                                                <dt>Disme:</dt>
                                                <dd><DismeStatus dismeStatus={serverDetails.Disme} /></dd>
                                            </dl>

                                            <dl class="dl-horizontal">
                                                <dt>Cloud:</dt>
                                                <dd>{serverDetails.VM ? serverDetails.VM.Cloud : ""}</dd>
                                                <dt>CPU:</dt>
                                                <dd>{serverDetails.VM ? serverDetails.VM.CPUCount : ""}</dd>
                                                <dt>Memory:</dt>
                                                <dd>{serverDetails.VM ? serverDetails.VM.Memory : ""}</dd>
                                                <dt>Network:</dt>
                                                <dd>{serverDetails.VM ? serverDetails.VM.VMNetwork : ""}</dd>
                                                <dt>Availability Set:</dt>
                                                <dd>{serverDetails.VM ? serverDetails.VM.AvailabilitySet : ""}</dd>
                                            </dl>

                                            <dl class="dl-horizontal">
                                                <dt>Kibana:</dt>
                                                <dd>
                                                    <a target="_blank" rel="noopener noreferrer" href={_.replace(KIBANA_WINLOGBEAT_SERVER_URL, new RegExp(KIBANA_SERVER_URL_PLACEHOLDER, "g"), serverDetails.ServerName)}>Eventlog</a><br />
                                                    <a target="_blank" rel="noopener noreferrer" href={_.replace(KIBANA_PERFCOUNTER_SERVER_URL, new RegExp(KIBANA_SERVER_URL_PLACEHOLDER, "g"), serverDetails.ServerName)}>PerfCounter</a>
                                                </dd>
                                            </dl>
                                        </Grid.Column>
                                        <Grid.Column width={16}>
                                            <dl class="dl-horizontal">
                                                <dt>AD Path:</dt>
                                                <dd style={{ wordWrap: 'break-word' }}>{serverDetails.ADPath}</dd>
                                            </dl>
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
                        <Grid.Column width={scomAlerts.length > 0 ? 10 : 5}>
                            <Header
                                block
                                attached='top'
                                as='h4'
                                style={{ backgroundColor: scomAlerts.length > 0  ? errorColor : {}}}>
                                SCOM Alerts
                                    <Button onClick={() => this.handleToggleShowingContent("scomalerts")} floated='right' icon='content' />
                            </Header>
                            {
                                scomalerts ? (
                                    <Segment attached='bottom'>
                                        <SCOMSegment data={scomAlerts} />
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
                                        <LoadBalancerFarmsBuffedTable data={serverDetails.LoadBalancerFarms} />
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
