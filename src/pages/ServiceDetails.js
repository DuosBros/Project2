import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { Grid, Header, Segment, Icon, List, Button, Message } from 'semantic-ui-react';
import moment from 'moment';

import { getServiceDetailsAction, toggleLoadBalancerFarmsTasksModalAction } from '../actions/ServiceActions';
import { getServiceDetails } from '../requests/ServiceAxios';
import ServerTable from '../components/ServerTable';
import WebsitesTable from '../components/WebsitesTable';
import { isAdmin } from '../utils/HelperFunction';
import LoadBalancerFarmsTable from '../components/LoadBalancerFarmsTable';
import DismeStatus from '../components/DismeStatus';
import { KIBANA_SERVICE_URL_PLACEHOLDER, KIBANA_WINLOGBEAT_SERVICE_URL, KIBANA_PERFCOUNTER_SERVICE_URL, DISME_SERVICE_URL, DISME_SERVICE_PLACEHOLDER } from '../appConfig';

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
        this.updateService(this.props.match.params.id);
    }

    updateService(id) {
        getServiceDetails(id)
            .then(res => {
                this.props.getServiceDetailsAction(res.data)
            })
    }

    componentDidUpdate(prevProps) {
        if (this.props.match && this.props.match.params) {
            const params = this.props.match.params;
            if (params.id && params.id !== prevProps.match.params.id) {
                this.updateService(this.props.match.params.id);
            }
        }
    }

    handleToggleShowingContent = (segment) => {
        this.setState({ [segment]: !this.state[segment] });
    }

    handleToggleShowAllSegments = () => {

        if (this.state.showAllSegments && (this.state.assignedLoadBalancerFarms || this.state.servers || this.state.websites)) {
            this.setState({
                showAllSegments: false,
                assignedLoadBalancerFarms: false,
                servers: false,
                websites: false,

            });
        }
        else {
            this.setState({
                showAllSegments: true,
                assignedLoadBalancerFarms: true,
                servers: true,
                websites: true,

            });
        }

    }

    render() {

        var serviceDetails = this.props.serviceStore.serviceDetails;
        var serviceDetailsBody;
        const { showAllSegments, assignedLoadBalancerFarms, servers, websites } = this.state;

        if (!_.isEmpty(serviceDetails)) {

            serviceDetailsBody = (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Service Info - {serviceDetails.Service[0].Shortcut}
                                <Button
                                    floated='right'
                                    onClick={() => this.handleToggleShowAllSegments()}
                                    content={showAllSegments && (assignedLoadBalancerFarms || servers || websites) ? 'Hide All Segments' : 'Show All Segments'}
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
                                                <dd>{serviceDetails.Service[0].Shortcut}</dd>
                                                <dt>Name:</dt>
                                                <dd>{serviceDetails.Service[0].Name}</dd>
                                            </dl>
                                            <dl className="dl-horizontal">
                                                <dt>Disme Status:</dt>
                                                <dd><DismeStatus dismeStatus={serviceDetails.Service[0].Status} /></dd>
                                            </dl>
                                            <dl className="dl-horizontal">
                                                <dt>DevFramework:</dt>
                                                <dd>{serviceDetails.Service[0].DevFramework}</dd>
                                                <dt>Framework:</dt>
                                                <dd>{serviceDetails.Service[0].Framework}</dd>
                                                <dt>Poolname:</dt>
                                                <dd>{serviceDetails.Service[0].Poolname}</dd>
                                                <dt>SiteID:</dt>
                                                <dd>{serviceDetails.Service[0].SiteID}</dd>
                                                <dt>ServiceName:</dt>
                                                <dd>{serviceDetails.Service[0].ServiceName}</dd>
                                                <dt>ServiceUser:</dt>
                                                <dd>{serviceDetails.Service[0].ServiceUser}</dd>
                                                <dt>HomeDir:</dt>
                                                <dd>{serviceDetails.Service[0].HomeDir}</dd>
                                            </dl>


                                        </Grid.Column>
                                        <Grid.Column width={8}>
                                            <dl className="dl-horizontal">
                                                <dt>Owner:</dt>
                                                <dd>{serviceDetails.Service[0].Owner}</dd>
                                                <dt>Responsible Team:</dt>
                                                <dd>{serviceDetails.Service[0].ResponsibleTeam}</dd>
                                            </dl>
                                            <dl className="dl-horizontal">
                                                <dt>Kibana:</dt>
                                                <dd>
                                                    <a target="_blank" rel="noopener noreferrer" href={_.replace(KIBANA_WINLOGBEAT_SERVICE_URL, new RegExp(KIBANA_SERVICE_URL_PLACEHOLDER, "g"), serviceDetails.Service[0].Shortcut)}>Eventlog</a><br />
                                                    <a target="_blank" rel="noopener noreferrer" href={_.replace(KIBANA_PERFCOUNTER_SERVICE_URL, new RegExp(KIBANA_SERVICE_URL_PLACEHOLDER, "g"), serviceDetails.Service[0].Shortcut)}>PerfCounter</a>
                                                </dd>
                                                <dt>AppDynamics:</dt>
                                                <dd>
                                                    <a target="_blank" href={"https://apm.bwinparty.corp/controller/#/location=APP_COMPONENT_MANAGER&timeRange=last_15_minutes.BEFORE_NOW.-1.-1.15&application=" + serviceDetails.Service[0].ApmAppId + "&component=" + serviceDetails.Service[0].ApmTierId + ")"} rel="noopener noreferrer"> Dashboard</a>
                                                </dd>
                                                <dt>Disme:</dt>
                                                <dd>
                                                    <a target="_blank" href={_.replace(DISME_SERVICE_URL, new RegExp(DISME_SERVICE_PLACEHOLDER, "g"), serviceDetails.Service[0].DismeID)} rel="noopener noreferrer">Details</a>
                                                </dd>
                                            </dl>
                                        </Grid.Column>
                                        {/* <Grid.Column width={16}>
                                            <dl className="dl-horizontal">
                                                <dt>AD Path:</dt>
                                                <dd style={{ wordWrap: 'break-word' }}>{serviceDetails.ADPath}</dd>
                                            </dl>
                                        </Grid.Column> */}
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                            <Header attached>
                                <List>
                                    <List.Item>
                                        <List.Content floated='left'>Last Update: {moment(serviceDetails.Service.LastUpdate).local().format("HH:mm:ss DD.MM.YYYY")} </List.Content>
                                        <List.Content floated='right'>Created: {moment(serviceDetails.Service.CreatedAt).local().format("HH:mm:ss DD.MM.YYYY")}</List.Content>
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
                                        <LoadBalancerFarmsTable data={serviceDetails.LbFarms} />
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
                                Servers
                                <Button onClick={() => this.handleToggleShowingContent("servers")} floated='right' icon='content' />
                            </Header>
                            {
                                servers ? (
                                    <Segment attached='bottom'>
                                        <ServerTable data={serviceDetails.Servers} compact={true} />
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
                                    <Segment attached='bottom' id="WebsitesTable">
                                        <WebsitesTable data={serviceDetails.Websites} />
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
            serviceDetailsBody = (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching service details</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            )
        }
        return (
            <div>
                {serviceDetailsBody}
            </div>
        )
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
