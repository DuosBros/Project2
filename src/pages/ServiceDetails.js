import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { Grid, Header, Segment, Divider, Icon, List, Image, Table, Button, Label } from 'semantic-ui-react';
import moment from 'moment';

import { getServiceDetailsAction, toggleLoadBalancerFarmsTasksModalAction } from '../actions/ServiceActions';
import { getServiceDetails } from '../requests/ServiceAxios';
import spinner from '../assets/Spinner.svg';
import SimpleTable from '../components/SimpleTable';
import ServerBuffedTable from '../components/ServerBuffedTable';
import WebsitesBuffedTable from '../components/WebsitesBuffedTable';
import { isAdmin } from '../utils/HelperFunction';

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

    componentDidUpdate(prevProps, prevState) {
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
        console.log(this.props.serviceStore.serviceDetails)

        var serviceDetails = this.props.serviceStore.serviceDetails;
        var serviceDetailsBody, assignedLoadBalancerFarmsTableColumnProperties,
            serversTableColumnProperties, serversTableRows, assignedLoadBalancerFarmsTableRows;
        const { showAllSegments, assignedLoadBalancerFarms, servers, websites } = this.state;

        if (!_.isEmpty(serviceDetails)) {
            assignedLoadBalancerFarmsTableColumnProperties = [
                {
                    name: "Name",
                    width: 4,
                },
                {
                    name: "Pool",
                    width: 4,
                },
                {
                    name: "Port",
                    width: 1,
                },
                {
                    name: "IpAddress",
                    width: 2,
                },
                {
                    name: "LoadBalancer",
                    width: 2,
                },
                {
                    name: "LBId",
                    width: 1,
                }
            ]

            if (_.isEmpty(serviceDetails.Service[0].LbFarms)) {
                assignedLoadBalancerFarmsTableRows = (
                    <Table.Row></Table.Row>
                )
            }
            else {
                assignedLoadBalancerFarmsTableRows = serviceDetails.Service.LbFarms.map(lbfarm => {
                    return (
                        <Table.Row key={lbfarm.Id}>
                            <Table.Cell>{lbfarm.Name}</Table.Cell>
                            <Table.Cell>{lbfarm.Pool}</Table.Cell>
                            <Table.Cell>{lbfarm.IpAddress}</Table.Cell>
                            <Table.Cell>{lbfarm.LbName}</Table.Cell>
                            <Table.Cell>{lbfarm.LbId}</Table.Cell>
                        </Table.Row>
                    )
                })
            }

            serviceDetailsBody = (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Service Info
                                    <Button
                                    floated='right'
                                    onClick={() => this.handleToggleShowAllSegments()}
                                    content={showAllSegments && (assignedLoadBalancerFarms || servers || websites) ? 'Hide All Segments' : 'Show All Segments'}
                                    icon='content'
                                    labelPosition='right'
                                    style={{ fontSize: 'medium', padding: '0.3em', bottom: '0.1em' }} />
                            </Header>
                            <Segment attached="bottom">
                                TODO: Ferdinand pleaze
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
                                        <SimpleTable columnProperties={assignedLoadBalancerFarmsTableColumnProperties} body={assignedLoadBalancerFarmsTableRows} />
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
                                        <ServerBuffedTable data={serviceDetails.Servers} />
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
                                    <Segment attached='bottom' id="websitesBuffedTable">
                                        <WebsitesBuffedTable data={serviceDetails} />
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
                <div className="centered">
                    <Image src={spinner} />
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
