import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { Grid, Header, Segment, Icon, List, Button, Message, Image, Popup } from 'semantic-ui-react';
import moment from 'moment';

import {
    getServiceDetailsAction, toggleLoadBalancerFarmsTasksModalAction, removeAllServiceDetailsAction,
    getServiceDeploymentStatsAction
} from '../utils/actions';
import { getServiceDetails, getServiceDeploymentStats } from '../requests/ServiceAxios';
import ServersTable from '../components/ServersTable';
import WebsitesTable from '../components/WebsitesTable';
import { isUser, groupBy } from '../utils/HelperFunction';
import LoadBalancerFarmsTable from '../components/LoadBalancerFarmsTable';
import DismeStatus from '../components/DismeStatus';
import { DISME_SERVICE_URL, DISME_SERVICE_PLACEHOLDER, APP_TITLE, DEFAULT_SERVICE_DEPLOYMENT_COUNT, DEFAULT_SERVICE_DEPLOYMENT_TO_RENDER } from '../appConfig';
import Kibana from '../utils/Kibana';
import ErrorMessage from '../components/ErrorMessage';

class ServiceDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAllSegments: true,
            assignedLoadBalancerFarms: true,
            servers: true,
            websites: true,
        }
    }

    componentDidMount() {
        this.updateService();
    }

    updateService = async () => {
        let res;
        try {
            res = await getServiceDetails(this.props.match.params.id)
            this.props.getServiceDetailsAction({ success: true, data: res.data })
            if (res.data.Service[0]) {
                document.title = APP_TITLE + res.data.Service[0].Name;
            }
            else {
                document.title = APP_TITLE + "Service Details"
            }
        }
        catch (err) {
            this.props.getServiceDetailsAction({ success: false, error: err })
        }

        if (res.data.Service[0]) {
            this.fetchServiceDeploymentAndHandleData(res.data.Service[0].Shortcut)
        }
    }

    fetchServiceDeploymentAndHandleData = (serviceShortcut) => {
        getServiceDeploymentStats(serviceShortcut, DEFAULT_SERVICE_DEPLOYMENT_COUNT)
            .then(res => {
                this.props.getServiceDeploymentStatsAction({ success: true, data: res.data.deployments })
            })
            .catch(err => {
                this.props.getServiceDeploymentStatsAction({ success: false, error: err })
            })
    }

    componentDidUpdate(prevProps) {
        if (this.props.match && this.props.match.params) {
            const params = this.props.match.params;
            if (params.id && params.id !== prevProps.match.params.id) {
                this.updateService();
            }
        }
    }

    handleToggleShowingContent = (segment) => {
        this.setState({ [segment]: !this.state[segment] });
    }

    handleToggleShowAllSegments = () => {

        var visible = !(this.state.assignedLoadBalancerFarms || this.state.servers || this.state.websites);
        this.setState({
            showAllSegments: visible,
            assignedLoadBalancerFarms: visible,
            servers: visible,
            websites: visible
        });
    }

    render() {
        const serviceDetailsSuccess = this.props.serviceStore.serviceDetails.success;
        const serviceDetailsData = Array.isArray(this.props.serviceStore.serviceDetails.data) ? null : this.props.serviceStore.serviceDetails.data
        const { assignedLoadBalancerFarms, servers, websites } = this.state;

        // in case of error
        if (!serviceDetailsSuccess) {
            return (
                <ErrorMessage handleRefresh={this.updateService} error={this.props.serviceStore.serviceDetails.error} />
            );
        }

        // in case it's still loading data
        if (_.isEmpty(serviceDetailsData)) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching service details</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            );
        }

        let deploymentsSegment;

        if (!serviceDetailsData.deploymentStats) {
            deploymentsSegment = (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching deployment stats</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            );
        }
        else {
            let deploymentStatsData = Array.isArray(serviceDetailsData.deploymentStats.data)
                ? serviceDetailsData.deploymentStats.data : null

            if (!serviceDetailsData.deploymentStats.success) {
                deploymentsSegment = (
                    <ErrorMessage handleRefresh={this.fetchServerDeploymentAndHandleData} error={serviceDetailsData.deploymentStats.error} />
                );
            }

            if (!deploymentStatsData) {
                deploymentsSegment = "No data available"
            }
            else {
                if (deploymentStatsData.length <= 0) {
                    deploymentsSegment = "No data available"
                }
                else {
                    let deploymentsSegmentItems = deploymentStatsData.map((x, i) => {
                        var grouped = groupBy(x.history, "version");
                        var keys = Object.keys(grouped).sort((a, b) => b - a).slice(0, DEFAULT_SERVICE_DEPLOYMENT_TO_RENDER);
                        return (
                            <React.Fragment key={i}>
                                <dt>
                                    {x.stage}
                                </dt>
                                <dd>
                                    {keys.map((y, j) => {
                                        return (
                                            <div key={j}>
                                                {grouped[y][0].version} | {grouped[y][0].userName} {grouped[y][0].changeNumber && (" | " + grouped[y][0].changeNumber)} | {moment(grouped[y][0].deployDateTime).local().fromNow()}
                                                <Popup closeOnPortalMouseLeave={true} trigger={<Icon size='small' name='question' />}><Popup.Content><pre>{JSON.stringify(grouped[y][0], null, 2)}</pre></Popup.Content></Popup>
                                            </div>
                                        )
                                    })}
                                </dd>
                            </React.Fragment>
                        )
                    })
                    deploymentsSegment = (
                        <dl className="dl-horizontal">
                            {deploymentsSegmentItems}
                        </dl>
                    )
                }
            }
        }

        // render page
        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Service Info - {serviceDetailsData.Service[0].Shortcut}
                            <Button
                                floated='right'
                                onClick={() => this.handleToggleShowAllSegments()}
                                content={(assignedLoadBalancerFarms || servers || websites) ? 'Hide All Segments' : 'Show All Segments'}
                                icon='content'
                                labelPosition='right'
                                style={{ fontSize: 'medium', padding: '0.3em', bottom: '0.1em' }} />
                        </Header>
                        <Segment style={{ marginBottom: '0px' }} attached="bottom">
                            <Grid stackable>
                                <Grid.Row>
                                    <Grid.Column width={5}>
                                        <dl className="dl-horizontal">
                                            <dt>Shortcut:</dt>
                                            <dd>{serviceDetailsData.Service[0].Shortcut}</dd>
                                            <dt>Name:</dt>
                                            <dd>{serviceDetailsData.Service[0].Name}</dd>
                                        </dl>
                                        <dl className="dl-horizontal">
                                            <dt>Disme Status:</dt>
                                            <dd><DismeStatus dismeStatus={serviceDetailsData.Service[0].Status} /></dd>
                                        </dl>
                                        <dl className="dl-horizontal">
                                            <dt>DevFramework:</dt>
                                            <dd>{serviceDetailsData.Service[0].DevFramework}</dd>
                                            <dt>Framework:</dt>
                                            <dd>{serviceDetailsData.Service[0].Framework}</dd>
                                            <dt>Poolname:</dt>
                                            <dd>{serviceDetailsData.Service[0].Poolname}</dd>
                                            <dt>SiteID:</dt>
                                            <dd>{serviceDetailsData.Service[0].SiteID}</dd>
                                            <dt>ServiceName:</dt>
                                            <dd>{serviceDetailsData.Service[0].ServiceName}</dd>
                                            <dt>ServiceUser:</dt>
                                            <dd>{serviceDetailsData.Service[0].ServiceUser}</dd>
                                            <dt>HomeDir:</dt>
                                            <dd>{serviceDetailsData.Service[0].HomeDir}</dd>
                                        </dl>


                                    </Grid.Column>
                                    <Grid.Column width={5}>
                                        <dl className="dl-horizontal">
                                            <dt>Owner:</dt>
                                            <dd>{serviceDetailsData.Service[0].Owner}</dd>
                                            <dt>Responsible Team:</dt>
                                            <dd>{serviceDetailsData.Service[0].ResponsibleTeam}</dd>
                                            <dt>Label:</dt>
                                            <dd>{serviceDetailsData.Service[0].Label}</dd>
                                            <dt>Application:</dt>
                                            <dd>{serviceDetailsData.Service[0].Application}</dd>
                                        </dl>
                                        <dl className="dl-horizontal">
                                            <dt>
                                                <Image inline src={window.location.protocol + '//' + window.location.host + "/icons/kibana.png"} />
                                                Kibana:
                                            </dt>
                                            <dd>
                                                <a target="_blank" rel="noopener noreferrer" href={Kibana.dashboardLinkBuilder("prod", "winlogbeat2").addFilter("env", "PROD").addFilter("app", serviceDetailsData.Service[0].Shortcut).build()}>Eventlog</a><br />
                                                <a target="_blank" rel="noopener noreferrer" href={Kibana.dashboardLinkBuilder("prod", "cpuAndRam").addFilter("app", serviceDetailsData.Service[0].Shortcut).setQuery("NOT beat.hostname:*PRE*").build()}>PerfCounter</a>
                                            </dd>
                                            <dt>
                                                <Image inline src={window.location.protocol + '//' + window.location.host + "/icons/apm.png"} />
                                                AppDynamics:
                                            </dt>
                                            <dd>
                                                <a target="_blank" href={"https://apm.bwinparty.corp/controller/#/location=APP_COMPONENT_MANAGER&timeRange=last_15_minutes.BEFORE_NOW.-1.-1.15&application=" + serviceDetailsData.Service[0].ApmAppId + "&component=" + serviceDetailsData.Service[0].ApmTierId + ")"} rel="noopener noreferrer"> Dashboard</a>
                                            </dd>
                                            <dt>
                                                <Image inline src={window.location.protocol + '//' + window.location.host + "/icons/disme.png"} />
                                                Disme:
                                            </dt>
                                            <dd>
                                                <a target="_blank" href={_.replace(DISME_SERVICE_URL, new RegExp(DISME_SERVICE_PLACEHOLDER, "g"), serviceDetailsData.Service[0].DismeID)} rel="noopener noreferrer">Details</a>
                                            </dd>
                                        </dl>
                                    </Grid.Column>
                                    <Grid.Column width={6}>
                                        <Header as='h5'>Latest deployments:</Header>
                                        <br />
                                        {deploymentsSegment}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                        <Header attached>
                            <List>
                                <List.Item>
                                    <List.Content floated='left'>Last Update: {moment(serviceDetailsData.Service[0].LastUpdate).local().format("HH:mm:ss DD.MM.YYYY")} </List.Content>
                                    <List.Content floated='right'>Created: {moment(serviceDetailsData.Service[0].CreatedAt).local().format("HH:mm:ss DD.MM.YYYY")}</List.Content>
                                </List.Item>
                            </List>
                        </Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Assigned LoadBalancer Farms
                            <Button
                                style={{ padding: '0em', marginRight: '0.5em' }}
                                onClick={() => this.handleToggleShowingContent("assignedLoadBalancerFarms")}
                                floated='right'
                                icon='content' />
                            <Button
                                id="primaryButton"
                                disabled={!isUser(this.props.baseStore.currentUser)}
                                onClick={() => this.props.toggleLoadBalancerFarmsTasksModalAction()}
                                style={{ padding: '0.3em', bottom: '0.1em' }}
                                size="small"
                                primary
                                floated='right'
                            >Add or Remove LoadBalancerFarms</Button>
                        </Header>
                        {
                            assignedLoadBalancerFarms ? (
                                <Segment attached='bottom'>
                                    <LoadBalancerFarmsTable data={serviceDetailsData.LbFarms} tableHeader="hidden" />
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
                            Servers
                            <Button onClick={() => this.handleToggleShowingContent("servers")} floated='right' icon='content' />
                        </Header>
                        {
                            servers ? (
                                <Segment attached='bottom'>
                                    <ServersTable data={serviceDetailsData.Servers} compact={true} />
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
                            Websites
                            <Button onClick={() => this.handleToggleShowingContent("websites")} floated='right' icon='content' />
                        </Header>
                        {
                            websites ? (
                                <Segment attached='bottom' id="WebsitesTable">
                                    <WebsitesTable data={serviceDetailsData.Websites} />
                                </Segment>
                            ) : (
                                    null
                                )
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

function mapStateToProps(state) {
    return {
        serviceStore: state.ServiceReducer,
        baseStore: state.BaseReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getServiceDetailsAction,
        toggleLoadBalancerFarmsTasksModalAction,
        removeAllServiceDetailsAction,
        getServiceDeploymentStatsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceDetails);
