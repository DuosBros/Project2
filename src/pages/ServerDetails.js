import React from 'react';
import { Grid, Header, Segment, Icon, List, Button, Message, Image, Popup } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment'

import ServiceTable from '../components/ServiceTable';
import ServerStatus from '../components/ServerStatus';
import WebsitesTable from '../components/WebsitesTable';
import WebChecksTable from '../components/WebChecksTable';

import { errorColor, APP_TITLE } from '../appConfig';

import Kibana from '../utils/Kibana';
import LoadBalancerFarmsTable from '../components/LoadBalancerFarmsTable';
import SCOMSegment from '../components/SCOMSegment';
import DismeStatus from '../components/DismeStatus';
import ErrorMessage from '../components/ErrorMessage';
import MinMaxAvgAreaChart from '../charts/MinMaxAvgAreaChart';
import { mapDataForMinMaxAvgChart } from '../utils/HelperFunction';
import WindowsServicesTable from '../components/WindowsServicesTable';

class ServerDetails extends React.PureComponent {

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

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            if (this.props.serverDetails.data) {
                document.title = APP_TITLE + this.props.serverDetails.data.ServerName;
            }
            else {
                document.title = APP_TITLE + "Server Details"
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
        var serverDetailsSuccess = this.props.serverDetails.success;
        var serverDetailsData = this.props.serverDetails.data;

        var scomAlertsSuccess = this.props.scomAlerts.success;
        var scomAlertsData = this.props.scomAlerts.data;
        var OSIcon, scomAlertsSegment;

        const { webchecks, dismeservices, loadbalancerfarms, windowsservices, websites, scomalerts } = this.state;

        // in case of error
        if (!serverDetailsSuccess) {
            return (
                <ErrorMessage handleRefresh={this.props.fetchServerDetails} error={this.props.serverDetails.error} />
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
                    <ErrorMessage handleRefresh={this.props.fetchServersAndHandleResult} error={this.props.serverDetails.error} />
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

        var ips = serverDetailsData.IPs.map(ip => {
            return (
                <span key={ip.Id}>{ip.IpAddress} <br /></span>
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

                if (serverDetailsData.serverStats.data.cpuUtilization) {
                    cpuUsageDetails = (
                        <MinMaxAvgAreaChart data={mapDataForMinMaxAvgChart(serverDetailsData.serverStats.data.cpuUtilization)} />
                    )
                }

                let memoryUsageDetails = "No data available";

                if (serverDetailsData.serverStats.data.memoryUsage) {
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

        let deploymentsSegment;

        if (!serverDetailsData.deploymentStats) {
            deploymentsSegment = (
                <Message info icon>
                    <Icon name='circle notched' loading />
                    <Message.Content>
                        <Message.Header>Fetching deployment stats</Message.Header>
                    </Message.Content>
                </Message>
            );
        }
        else {
            let deploymentStatsData = Array.isArray(serverDetailsData.deploymentStats.data) ? serverDetailsData.deploymentStats.data : null

            if (!serverDetailsData.deploymentStats.success) {
                deploymentsSegment = (
                    <ErrorMessage handleRefresh={this.props.fetchServerDetails} error={serverDetailsData.deploymentStats.error} />
                );
            }

            if (!deploymentStatsData || deploymentStatsData.length <= 0) {
                deploymentsSegment = "No data available"
            }
            else {
                let deploymentsSegmentItems = deploymentStatsData.map((x, i) => {
                    return (
                        <List.Item key={i}>
                            <List.Header>
                                {moment(x.deployDateTime).local().fromNow()} | {x.userName} <Popup closeOnPortalMouseLeave={true} trigger={<Icon size='small' name='question' />}><Popup.Content><pre>{JSON.stringify(x, null, 2)}</pre></Popup.Content></Popup>
                            </List.Header>
                            Version: {x.version} {x.changeNumber && " | CHG: " + x.changeNumber}
                        </List.Item>
                    )
                })
                deploymentsSegment = (
                    <List>
                        {deploymentsSegmentItems}
                    </List>
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
                                onClick={this.handleToggleShowAllSegments}
                                content={(scomalerts || webchecks || dismeservices || loadbalancerfarms || windowsservices || websites) ? 'Hide All Segments' : 'Show All Segments'}
                                icon='content'
                                labelPosition='right'
                                style={{ fontSize: 'medium', padding: '0.3em', bottom: '0.1em' }} />
                        </Header>
                        <Segment attached>
                            <Grid stackable>
                                <Grid.Row>
                                    <Grid.Column width={4}>
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
                                    <Grid.Column width={3}>
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
                                            <dt>
                                                <Image inline src={window.location.protocol + '//' + window.location.host + "/icons/kibana.png"} />
                                                Kibana:
                                            </dt>
                                            <dd>
                                                <a target="_blank" rel="noopener noreferrer" href={Kibana.dashboardLinkBuilder("prod", "winlogbeat2").addFilter("beat.hostname", serverDetailsData.ServerName).build()}>Eventlog</a><br />
                                                <a target="_blank" rel="noopener noreferrer" href={Kibana.dashboardLinkBuilder("prod", "metricsWindows").addFilter("beat.hostname", serverDetailsData.ServerName).build()}>PerfCounter</a>
                                            </dd>
                                        </dl>
                                    </Grid.Column>
                                    <Grid.Column width={6}>
                                        {serverStatsSegment}
                                    </Grid.Column>
                                    <Grid.Column width={3}>
                                        <strong>Latest deployments:</strong>
                                        <br />
                                        {deploymentsSegment}
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
                            webchecks && (
                                <Segment attached='bottom'>
                                    <WebChecksTable data={serverDetailsData.WebChecks} tableHeader={false} compact="very" />
                                </Segment>
                            )
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={scomAlertsSuccess && scomAlertsData ? (scomAlertsData.length > 0 ? 6 : 13) : (13)}>
                        <Header block attached='top' as='h4'>
                            Disme Services
                                    <Button onClick={() => this.handleToggleShowingContent("dismeservices")} floated='right' icon='content' />
                        </Header>
                        {
                            dismeservices && (
                                <Segment attached='bottom'>
                                    <ServiceTable data={serverDetailsData.ServicesFull} tableHeader="hidden" compact="very" />
                                </Segment>
                            )
                        }
                    </Grid.Column>
                    <Grid.Column width={scomAlertsSuccess && scomAlertsData ? (scomAlertsData.length > 0 ? 10 : 3) : (3)}>
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
                                scomAlertsSuccess && scomAlertsData && (
                                    scomAlertsData.length > 0 && (
                                        scomAlertsSegment
                                    )
                                )
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
                            websites && (
                                <Segment attached='bottom'>
                                    <WebsitesTable data={serverDetailsData.Websites} disableGrouping={true} tableHeader="hidden" />
                                </Segment>
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
                            loadbalancerfarms && (
                                <Segment attached='bottom'>
                                    <LoadBalancerFarmsTable data={serverDetailsData.LoadBalancerFarms} isEdit={false} />
                                </Segment>
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
                            windowsservices && (
                                <Segment attached='bottom'>
                                    <WindowsServicesTable data={serverDetailsData.WindowsServices} tableHeader={false} compact="very" />
                                </Segment>
                            )
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default ServerDetails;
