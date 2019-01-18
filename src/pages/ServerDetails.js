import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Segment, Icon, List, Table, Button, Message } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment'

import SimpleTable from '../components/SimpleTable';
import ServerStatus from '../components/ServerStatus';

import { getServerDetailsAction, getVmDetailsAction, getServerScomAlertsAction, getServerStatsAction } from '../actions/ServerActions';
import { getServerDetails, getServerScomAlerts, getDiskUsageDetails } from '../requests/ServerAxios';

import { DISME_SERVICE_PLACEHOLDER, DISME_SERVICE_URL, errorColor } from '../appConfig';

import Kibana from '../utils/Kibana';
import LoadBalancerFarmsTable from '../components/LoadBalancerFarmsTable';
import SCOMSegment from '../components/SCOMSegment';
import DismeStatus from '../components/DismeStatus';
import { Link } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import MinMaxAvgAreaChart from '../charts/MinMaxAvgAreaChart';
import { mapDataForMinMaxAvgChart } from '../utils/HelperFunction';

class ServerDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            websites: true,
            dismeservices: true,
            scomalerts: true,
            loadbalancerfarms: true,
            windowsservices: true,
            webchecks: true,
            showAllSegments: true
        }
    }

    componentWillUnmount() {
        this.props.getServerScomAlertsAction({ success: true })
    }

    componentDidMount() {
        this.updateServer();
    }

    updateServer = () => {
        getServerDetails(this.props.match.params.id)
            .then(res => {
                this.props.getServerDetailsAction({ success: true, data: res.data })
                return res
            })
            .catch((err) => {
                this.props.getServerDetailsAction({ success: false, error: err });
            })
            .then(res => {
                if (!res) {
                    return
                }

                if (_.isEmpty(res.data)) {
                    return
                }
                getServerScomAlerts(res.data.ServerName)
                    .then(res => {
                        if (!_.isEmpty(res)) {
                            this.props.getServerScomAlertsAction({ success: true, data: res.data })
                        }
                    })
                    .catch((err) => {
                        this.props.getServerScomAlertsAction({ success: false, error: err });
                    })

                return res
            })
            .catch((err) => {
                this.props.getServerScomAlertsAction({ success: false, error: err });
            })
            .then((res) => {
                if (!res) {
                    return
                }

                if (_.isEmpty(res.data)) {
                    return
                }

                return getDiskUsageDetails(res.data.ServerName)
            })
            .then(res => {
                this.props.getServerStatsAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getServerStatsAction({ success: false, error: err })
            })
    }

    componentDidUpdate(prevProps) {

        if (this.props.match && this.props.match.params) {
            const params = this.props.match.params;
            if (params.id && params.id !== prevProps.match.params.id) {
                this.updateServer();
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
        var serverDetailsSuccess = this.props.serverStore.serverDetails.success;
        var serverDetailsData = this.props.serverStore.serverDetails.data;

        var scomAlertsSuccess = this.props.serverStore.scomAlerts.success;
        var scomAlertsData = this.props.serverStore.scomAlerts.data;
        var OSIcon, servicesTableRows, serviceTableColumnProperties, websitesTableRows, websitesTableColumnProperties, windowsServicesTableColumnProperties,
            windowsServicesTableRows, webChecksTableColumnProperties, webChecksTableRows, scomAlertsSegment;

        const { webchecks, dismeservices, loadbalancerfarms, windowsservices, websites, scomalerts } = this.state;

        // in case of error
        if (!serverDetailsSuccess) {
            return (
                <ErrorMessage handleRefresh={this.updateServer} error={this.props.serverStore.serverDetails.error} />
            );
        }

        // in case it's still loading data
        if (_.isEmpty(serverDetailsData)) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching server details</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            );
        }

        // in case it's still loading data
        if (!scomAlertsData) {
            // in case of error
            if (!scomAlertsSuccess) {
                scomAlertsSegment = (
                    <ErrorMessage handleRefresh={this.updateServer} error={this.props.serverStore.serverDetails.error} />
                )
            }
            else {
                scomAlertsSegment = (
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching scom alerts</Message.Header>
                        </Message.Content>
                    </Message>
                );
            }
        }
        // render segment
        else {
            scomAlertsSegment = (
                <Segment attached='bottom'>
                    <SCOMSegment data={scomAlertsData} />
                </Segment>

            )
        }

        if (!_.isEmpty(serverDetailsData.OperatingSystem)) {
            if (serverDetailsData.OperatingSystem.search(new RegExp("windows", "i")) >= 0) {
                OSIcon = (<Icon circular name='windows' />)
            }

            if (serverDetailsData.OperatingSystem.search(new RegExp("linux", "i")) >= 0) {
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

        webChecksTableRows = serverDetailsData.WebChecks.map(webcheck => {
            return (
                <Table.Row key={webcheck.Id}>
                    <Table.Cell >{webcheck.Title}</Table.Cell>
                    <Table.Cell ><a href={webcheck.Url} target="_blank" rel="noopener noreferrer">{webcheck.Url}</a></Table.Cell>
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

        servicesTableRows = serverDetailsData.ServicesFull.map(service => {
            return (
                <Table.Row key={service.Id}>
                    <Table.Cell>{service.Name}</Table.Cell>
                    <Table.Cell>
                        <Link to={'/service/' + service.Id}>{service.Shortcut}</Link>
                    </Table.Cell>
                    <Table.Cell>
                        <DismeStatus dismeStatus={service.Status} />
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
                name: "Status",
                width: 2
            },
            {
                name: "Disme",
                width: 1,
            }
        ];

        websitesTableRows = serverDetailsData.Websites.map(website => {
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

        var ips = serverDetailsData.IPs.map(ip => {
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

        windowsServicesTableRows = serverDetailsData.WindowsServices.map(service => {
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

        var serverStatsSegment;

        if (_.isEmpty(serverDetailsData.serverStats)) {
            serverStatsSegment = (
                <Message info icon>
                    <Icon name='circle notched' loading />
                    <Message.Content>
                        <Message.Header>Fetching server stats</Message.Header>
                    </Message.Content>
                </Message>
            )
        }
        else {
            if (!serverDetailsData.serverStats.success) {
                serverStatsSegment = (
                    <ErrorMessage message="Could not fetch server stats from elastic" />
                )
            }
            else {
                let diskUsageDetails = "No data available"
                let diskUsageTs;
                if (serverDetailsData.serverStats.data.diskUsage) {
                    diskUsageTs = moment(serverDetailsData.serverStats.data.diskUsage.ts).format("DD.MM.YYYY HH:mm");
                    diskUsageDetails = serverDetailsData.serverStats.data.diskUsage.mounts.map((x, i) => {
                        var mountInfo = (
                            <React.Fragment key={i}>
                                <strong className="leftMargin">
                                    {x.mount}
                                </strong>
                                <span className="leftMargin">
                                    {Math.round((x.pct) * 100) + " %"}
                                </span>
                                <br />
                            </React.Fragment>
                        )
                        return mountInfo
                    });
                }

                let cpuUsageDetails = "No data available"

                if (serverDetailsData.serverStats.data.cpuUtilization.length !== 0) {
                    cpuUsageDetails = (
                        <MinMaxAvgAreaChart data={mapDataForMinMaxAvgChart(serverDetailsData.serverStats.data.cpuUtilization)} />
                    )
                }

                let memoryUsageDetails = "No data available";

                if (serverDetailsData.serverStats.data.memoryUsage.length !== 0) {
                    memoryUsageDetails = (
                        <MinMaxAvgAreaChart data={mapDataForMinMaxAvgChart(serverDetailsData.serverStats.data.memoryUsage)} />
                    )
                }

                serverStatsSegment = (
                    <>
                        <dl className="dl-horizontal">
                            <dt>Disk Usage: <br />{diskUsageTs}</dt>
                            <dd>{diskUsageDetails}</dd>
                        </dl>
                        <dl className="dl-horizontal">
                            <dt>CPU Usage:</dt>
                            <dd>{cpuUsageDetails}</dd>
                        </dl>
                        <dl className="dl-horizontal">
                            <dt>Memory Usage:</dt>
                            <dd>{memoryUsageDetails}</dd>
                        </dl>
                    </>
                )
            }
        }


        // render page
        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Server Info - {serverDetailsData.ServerName}
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
                                    <Grid.Column width={5}>
                                        <dl className="dl-horizontal">
                                            <dt>Server Name:</dt>
                                            <dd>{serverDetailsData.ServerName}</dd>

                                        </dl>
                                        <dl className="dl-horizontal">
                                            <dt>State:</dt>
                                            <dd><ServerStatus serverState={serverDetailsData.ServerState} /></dd>
                                            <dt>Disme:</dt>
                                            <dd><DismeStatus dismeStatus={serverDetailsData.Disme} /></dd>
                                        </dl>
                                        <dl className="dl-horizontal">
                                            <dt>IP:</dt>
                                            <dd>{ips}</dd>
                                        </dl>

                                        <dl className="dl-horizontal">
                                            <dt>Stage:</dt>
                                            <dd>{serverDetailsData.Stage}</dd>
                                            <dt>Environment:</dt>
                                            <dd>{serverDetailsData.Environment}</dd>
                                            <dt>Datacenter:</dt>
                                            <dd>{serverDetailsData.DataCenter}</dd>
                                            <dt>Country:</dt>
                                            <dd>{serverDetailsData.CountryName}</dd>
                                        </dl>

                                        <dl className="dl-horizontal">
                                            <dt>FQDN:</dt>
                                            <dd>{serverDetailsData.FQDN}</dd>
                                            <dt>Domain:</dt>
                                            <dd>{serverDetailsData.Domain}</dd>
                                        </dl>
                                    </Grid.Column>
                                    <Grid.Column width={5}>
                                        <dl className="dl-horizontal">
                                            <dt>OS:</dt>
                                            <dd>{OSIcon} {serverDetailsData.OperatingSystem}</dd>
                                        </dl>
                                        <dl className="dl-horizontal">
                                            <dt>Server Owner:</dt>
                                            <dd>{serverDetailsData.ServerOwner}</dd>
                                            <dt>PatchGroup:</dt>
                                            <dd>{serverDetailsData.PatchGroupName ? (serverDetailsData.PatchGroupName) : ('Not assigned ') + serverDetailsData.PatchID}</dd>
                                        </dl>

                                        <dl className="dl-horizontal">
                                            <dt>Cloud:</dt>
                                            <dd>{serverDetailsData.VM ? serverDetailsData.VM.Cloud : ""}</dd>
                                            <dt>CPU:</dt>
                                            <dd>{serverDetailsData.VM ? serverDetailsData.VM.CPUCount : ""}</dd>
                                            <dt>Memory:</dt>
                                            <dd>{serverDetailsData.VM ? serverDetailsData.VM.Memory : ""}</dd>
                                            <dt>Network:</dt>
                                            <dd>{serverDetailsData.VM ? serverDetailsData.VM.VMNetwork : ""}</dd>
                                            <dt>Availability Set:</dt>
                                            <dd>{serverDetailsData.VM ? serverDetailsData.VM.AvailabilitySet : ""}</dd>
                                        </dl>

                                        <dl className="dl-horizontal">
                                            <dt>Kibana:</dt>
                                            <dd>
                                                <a target="_blank" rel="noopener noreferrer" href={Kibana.dashboardLinkBuilder("prod", "winlogbeat2").addFilter("beat.hostname", serverDetailsData.ServerName).build()}>Eventlog</a><br />
                                                <a target="_blank" rel="noopener noreferrer" href={Kibana.dashboardLinkBuilder("prod", "metricsWindows").addFilter("beat.hostname", serverDetailsData.ServerName).build()}>PerfCounter</a>
                                            </dd>
                                        </dl>
                                    </Grid.Column>
                                    <Grid.Column width={6}>
                                        {serverStatsSegment}

                                    </Grid.Column>
                                    <Grid.Column width={16}>
                                        <dl className="dl-horizontal">
                                            <dt>AD Path:</dt>
                                            <dd style={{ wordWrap: 'break-word' }}>{serverDetailsData.ADPath}</dd>
                                        </dl>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                        <Header attached>
                            <List>
                                <List.Item>
                                    <List.Content floated='left'>Last Update: {moment(serverDetailsData.LastUpdate).local().format("HH:mm:ss DD.MM.YYYY")} </List.Content>
                                    <List.Content floated='right'>Created: {moment(serverDetailsData.CreatedAt).local().format("HH:mm:ss DD.MM.YYYY")}</List.Content>
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
                                    <SimpleTable columnProperties={webChecksTableColumnProperties} body={webChecksTableRows} compact="very" />
                                </Segment>
                            ) : (
                                    null
                                )
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={scomAlertsSuccess && scomAlertsData ? (scomAlertsData.length > 0 ? 6 : 11) : (11)}>
                        <Header block attached='top' as='h4'>
                            Disme Services
                                    <Button onClick={() => this.handleToggleShowingContent("dismeservices")} floated='right' icon='content' />
                        </Header>
                        {
                            dismeservices ? (
                                <Segment attached='bottom'>
                                    <SimpleTable columnProperties={serviceTableColumnProperties} body={servicesTableRows} compact="very" />
                                </Segment>
                            ) : (
                                    null
                                )
                        }
                    </Grid.Column>
                    <Grid.Column width={scomAlertsSuccess && scomAlertsData ? (scomAlertsData.length > 0 ? 10 : 5) : (5)}>
                        <Header
                            block
                            attached='top'
                            as='h4'
                            style={{ backgroundColor: scomAlertsSuccess && scomAlertsData ? (scomAlertsData.length > 0 ? errorColor : null) : (null) }}>
                            SCOM Alerts
                        <Button onClick={() => this.handleToggleShowingContent("scomalerts")} floated='right' icon='content' />
                        </Header>
                        {scomalerts ? (
                            scomAlertsSegment) : (
                                // show the scom segment if there is a scom error eventhough it was collapsed on the previous server details page
                                // sorry to whoever has to troubleshoot this
                                scomAlertsSuccess && scomAlertsData ? (
                                    scomAlertsData.length > 0 ? (
                                        scomAlertsSegment
                                    ) : (
                                            null
                                        )
                                ) : (null)
                            )}
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
                                    <SimpleTable columnProperties={websitesTableColumnProperties} body={websitesTableRows} compact={true} />
                                </Segment>
                            ) : (
                                    null
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
                                    <LoadBalancerFarmsTable data={serverDetailsData.LoadBalancerFarms} isEdit={false} />
                                </Segment>
                            ) : (
                                    null
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
                                    <SimpleTable columnProperties={windowsServicesTableColumnProperties} body={windowsServicesTableRows} compact={true} />
                                </Segment>
                            ) : (
                                    null
                                )
                        }

                    </Grid.Column>
                </Grid.Row>
            </Grid>
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
        getServerScomAlertsAction,
        getServerStatsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ServerDetails);
