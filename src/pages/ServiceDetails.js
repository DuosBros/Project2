import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { Grid, Header, Segment, Icon, List, Button, Message, Image } from 'semantic-ui-react';
import moment from 'moment';

import { getServiceDetailsAction, toggleLoadBalancerFarmsTasksModalAction } from '../actions/ServiceActions';
import { getServiceDetails } from '../requests/ServiceAxios';
import ServersTable from '../components/ServersTable';
import WebsitesTable from '../components/WebsitesTable';
import { isAdmin } from '../utils/HelperFunction';
import LoadBalancerFarmsTable from '../components/LoadBalancerFarmsTable';
import DismeStatus from '../components/DismeStatus';
import { DISME_SERVICE_URL, DISME_SERVICE_PLACEHOLDER } from '../appConfig';
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

    updateService = () => {
        getServiceDetails(this.props.match.params.id)
            .then(res => {
                this.props.getServiceDetailsAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getServiceDetailsAction({ success: false, error: err })
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
        const serviceDetailsData = this.props.serviceStore.serviceDetails.data;
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
                                    <Grid.Column width={8}>
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
                                    <Grid.Column width={8}>
                                        <dl className="dl-horizontal">
                                            <dt>Owner:</dt>
                                            <dd>{serviceDetailsData.Service[0].Owner}</dd>
                                            <dt>Responsible Team:</dt>
                                            <dd>{serviceDetailsData.Service[0].ResponsibleTeam}</dd>
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
                                </Grid.Row>
                            </Grid>
                        </Segment>
                        <Header attached>
                            <List>
                                <List.Item>
                                    <List.Content floated='left'>Last Update: {moment(serviceDetailsData.Service.LastUpdate).local().format("HH:mm:ss DD.MM.YYYY")} </List.Content>
                                    <List.Content floated='right'>Created: {moment(serviceDetailsData.Service.CreatedAt).local().format("HH:mm:ss DD.MM.YYYY")}</List.Content>
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
                                disabled={!isAdmin(this.props.baseStore.currentUser)}
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
                                    <LoadBalancerFarmsTable data={serviceDetailsData.LbFarms} showTableHeaderFunctions={false} />
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
        toggleLoadBalancerFarmsTasksModalAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceDetails);
