import React from 'react';
import { Button, Modal, Header, Segment, Grid } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { toggleLoadBalancerFarmsTasksModalAction } from '../actions/ServiceActions';
import { toggleNotAuthorizedModalAction } from '../actions/BaseAction'
import { getAllLoadBalancerFarmsAction } from '../actions/LoadBalancerFarmsAction'

import { isAdmin, groupBy } from '../utils/HelperFunction';
import NotAuthorized from './NotAuthorized';
import LoadBalancerFarmsTable from '../components/LoadBalancerFarmsTable';
import { getAllLoadBalancerFarms, saveLoadBalancerFarmsChanges } from '../requests/LoadBalancerFarmsAxios';
import { getServiceDetails } from '../requests/ServiceAxios';
import { getServiceDetailsAction } from '../actions/ServiceActions';

class LoadBalancerFarmsTasks extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loadBalancerFarmsToAdd: [],
            loadBalancerFarmsToRemove: []
        }
    }

    componentWillReceiveProps(next) {
        if (this.props.show !== next.show) {
            this.setState({ loadBalancerFarmsToAdd: [], loadBalancerFarmsToRemove: [] });
            getAllLoadBalancerFarms()
                .then(res => {
                    this.props.getAllLoadBalancerFarmsAction(res.data)
                })
        }
    }

    handleSave = () => {
        var serviceDetails = this.props.serviceStore.serviceDetails.Service[0]
        var merged = this.state.loadBalancerFarmsToAdd.concat(this.state.loadBalancerFarmsToRemove)
        var grouped = groupBy(merged, "LbId")
        var keys = Object.keys(grouped);

        for (let i = 0; i < keys.length; i = i + 2) {
            var that = this;
            saveLoadBalancerFarmsChanges(serviceDetails.Id, grouped[keys[i]].map(x => x.Id).join(','), keys[i])
                .then(() => {
                    if (i + 1 < keys.length) {
                        return saveLoadBalancerFarmsChanges(serviceDetails.Id, grouped[keys[i + 1]].map(x => x.Id).join(','), keys[i + 1])
                    }
                })
                .then(() => {
                    that.props.toggleLoadBalancerFarmsTasksModalAction()
                    getServiceDetails(serviceDetails.Id)
                        .then(res => {
                            this.props.getServiceDetailsAction(res.data)
                        })
                })
        }
    }

    handleAdd = (item) => {
        if (this.state.loadBalancerFarmsToAdd.findIndex(lb => lb.Id === item.Id) > -1) {
            this.setState({
                loadBalancerFarmsToAdd: this.state.loadBalancerFarmsToAdd.filter(x => {
                    return x.Id !== item.Id
                })
            });
        }
        else {
            this.setState(prevState => ({
                loadBalancerFarmsToAdd: [...prevState.loadBalancerFarmsToAdd, item]
            }))
        }
    }

    handleRemove = (item) => {
        if (this.state.loadBalancerFarmsToRemove.findIndex(lb => lb.Id === item.Id) > -1) {
            this.setState({
                loadBalancerFarmsToRemove: this.state.loadBalancerFarmsToRemove.filter(x => {
                    return x.Id !== item.Id
                })
            });
        }
        else {
            this.setState(prevState => ({
                loadBalancerFarmsToRemove: [...prevState.loadBalancerFarmsToRemove, item]
            }))
        }
    }

    render() {
        if (isAdmin(this.props.baseStore.currentUser)) {

            var serviceDetails = this.props.serviceStore.serviceDetails;

            if (!_.isEmpty(serviceDetails)) {
                var allLoadBalancerFarms = this.props.loadBalancerFarmsStore.loadBalancerFarms
                var filteredLoadBalancerFarms = null;

                if (allLoadBalancerFarms !== null) {
                    filteredLoadBalancerFarms = allLoadBalancerFarms.filter((el) => !serviceDetails.LbFarms.map(x => x.Id).includes(el.Id));
                }


                var modalBody = (
                    <React.Fragment>
                        <Modal.Header>Add or Remove LoadBalancerFarm - {serviceDetails.Service[0].Shortcut}</Modal.Header>
                        <Modal.Content>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Header block attached='top' as='h4'>
                                            Assign LoadBalancerFarms to Service
                                        </Header>
                                        <Segment attached='bottom'>
                                            <LoadBalancerFarmsTable
                                                isEdit={true}
                                                isAdd={true}
                                                data={filteredLoadBalancerFarms}
                                                multiSearchInput={serviceDetails.Service[0].Name}
                                                handleAdd={this.handleAdd}
                                                handleRemove={this.handleRemove}
                                                toAdd={this.state.loadBalancerFarmsToAdd}
                                                toRemove={this.state.loadBalancerFarmsToRemove}
                                                placeholder="Fetching loadbalancer farms" />
                                        </Segment>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Header block attached='top' as='h4'>
                                            Assigned LoadBalancer Farms
                                        </Header>
                                        <Segment attached='bottom'>
                                            <LoadBalancerFarmsTable data={serviceDetails.LbFarms}
                                                isEdit={true}
                                                isAdd={false}
                                                handleAdd={this.handleAdd}
                                                handleRemove={this.handleRemove}
                                                toAdd={this.state.loadBalancerFarmsToAdd}
                                                toRemove={this.state.loadBalancerFarmsToRemove} />
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
                    size='fullscreen'
                    open={this.props.show}
                    closeOnEscape={true}
                    closeOnDimmerClick={false}
                    closeIcon={true}
                    onClose={() => this.props.toggleLoadBalancerFarmsTasksModalAction()}
                >
                    {modalBody}
                    <Modal.Actions>

                        {
                            this.state.loadBalancerFarmsToAdd.length > 0 || this.state.loadBalancerFarmsToRemove.length > 0 ?
                                (<>
                                    <Button
                                        onClick={() => this.handleSave()}
                                        positive
                                        content={'Save (' + (this.state.loadBalancerFarmsToAdd.length + this.state.loadBalancerFarmsToRemove.length) + ') changes'}>
                                    </Button>
                                    <Button
                                        onClick={() => this.props.toggleLoadBalancerFarmsTasksModalAction()}
                                        labelPosition='right'
                                        icon='checkmark'
                                        content='Close'
                                    />
                                </>) : (<Button
                                    onClick={() => this.props.toggleLoadBalancerFarmsTasksModalAction()}
                                    positive
                                    labelPosition='right'
                                    icon='checkmark'
                                    content='Close'
                                />)
                        }
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
        serviceStore: state.ServiceReducer,
        loadBalancerFarmsStore: state.LoadBalancerFarmsReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleLoadBalancerFarmsTasksModalAction,
        toggleNotAuthorizedModalAction,
        getAllLoadBalancerFarmsAction,
        getServiceDetailsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadBalancerFarmsTasks);
