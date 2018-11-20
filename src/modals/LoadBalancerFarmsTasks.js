import React from 'react';
import { Button, Modal, Header, Segment, Grid, Table } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { toggleLoadBalancerFarmsTasksModalAction } from '../actions/ServiceActions';
import { toggleNotAuthorizedModalAction } from '../actions/BaseAction'

import { isAdmin } from '../utils/HelperFunction';
import NotAuthorized from './NotAuthorized';
import SimpleTable from '../components/SimpleTable';

class LoadBalancerFarmsTasks extends React.Component {

    // constructor(props) {
    //     super(props)

    //     this.state = {
    //         isAdmin: false
    //     }

    //     if(isAdmin(this.props.baseStore.currentUser)) {
    //         this.setState({ isAdmin: true });
    //     }
    //     else {
    //         this.setState({isAdmin: false})
    //     }

    // }
    render() {
        if (isAdmin(this.props.baseStore.currentUser)) {

            var serviceDetails = this.props.serviceStore.serviceDetails;
            var assignedLoadBalancerFarmsTableColumnProperties, assignedLoadBalancerFarmsTableRows;

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

            if (!_.isEmpty(serviceDetails)) {
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

                var modalBody = (
                    <React.Fragment>
                        <Modal.Header>Add or Remove LoadBalancerFarm</Modal.Header>
                        <Modal.Description>{this.props.serviceStore.serviceDetails.Service[0].Shortcut}</Modal.Description>
                        <Modal.Content>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Header block attached='top' as='h4'>
                                            Assigned LoadBalancer Farms
                                        </Header>
                                        <Segment attached='bottom'>
                                            <SimpleTable columnProperties={assignedLoadBalancerFarmsTableColumnProperties} body={assignedLoadBalancerFarmsTableRows} />
                                        </Segment>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Modal.Content>
                    </React.Fragment>
                )
            }

           

            return (
                <Modal
                    size='large'
                    open={this.props.show}
                    closeOnEscape={true}
                    closeOnDimmerClick={false}
                    closeIcon={true}
                    onClose={() => this.props.toggleLoadBalancerFarmsTasksModalAction()}
                >

                    {modalBody}

                    <Modal.Actions>
                        <Button
                            onClick={() => this.props.toggleLoadBalancerFarmsTasksModalAction()}
                            positive
                            labelPosition='right'
                            icon='checkmark'
                            content='Close'
                        />
                    </Modal.Actions>
                </Modal>
            )
        }
        else {
            return (
                <NotAuthorized
                    parentAction={this.props.toggleLoadBalancerFarmsTasksModalAction}
                    userDetails={this.props.baseStore.currentUser}
                    show={this.props.show && !isAdmin(this.props.baseStore.currentUser)} />
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        baseStore: state.BaseReducer,
        serviceStore: state.ServiceReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleLoadBalancerFarmsTasksModalAction,
        toggleNotAuthorizedModalAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadBalancerFarmsTasks);