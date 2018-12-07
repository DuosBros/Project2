import React from 'react';
import { Button, Modal, Header, Segment, Grid } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { toggleLoadBalancerFarmsTasksModalAction } from '../actions/ServiceActions';
import { toggleNotAuthorizedModalAction } from '../actions/BaseAction'
import { getAllLoadBalancerFarmsAction } from '../actions/LoadBalancerFarmsAction'

import { isAdmin } from '../utils/HelperFunction';
import NotAuthorized from './NotAuthorized';
import LoadBalancerFarmsTable from '../components/LoadBalancerFarmsTable';
import { getAllLoadBalancerFarms } from '../requests/LoadBalancerFarmsAxios';

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

    handleAdd = (id) => {
        if (this.state.loadBalancerFarmsToAdd.indexOf(id) > -1) {
            this.setState({
                loadBalancerFarmsToAdd: this.state.loadBalancerFarmsToAdd.filter(x => {
                    return x !== id
                })
            });
        }
        else {
            this.setState(prevState => ({
                loadBalancerFarmsToAdd: [...prevState.loadBalancerFarmsToAdd, id]
            }))
        }
    }

    handleRemove = (id) => {
        if (this.state.loadBalancerFarmsToRemove.indexOf(id) > -1) {
            this.setState({
                loadBalancerFarmsToRemove: this.state.loadBalancerFarmsToRemove.filter(x => {
                    return x !== id
                })
            });
        }
        else {
            this.setState(prevState => ({
                loadBalancerFarmsToRemove: [...prevState.loadBalancerFarmsToRemove, id]
            }))
        }
    }

    render() {
        console.log(this.props.loadBalancerFarmsStore.loadBalancerFarms)
        if (isAdmin(this.props.baseStore.currentUser)) {

            var serviceDetails = this.props.serviceStore.serviceDetails;

            if (!_.isEmpty(serviceDetails)) {

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
                                                data={this.props.loadBalancerFarmsStore.loadBalancerFarms}
                                                multiSearchInput={serviceDetails.Service[0].Name}
                                                handleAdd={this.handleAdd}
                                                handleRemove={this.handleRemove}
                                                toAdd={this.state.loadBalancerFarmsToAdd}
                                                toRemove={this.state.loadBalancerFarmsToRemove} />
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
        getAllLoadBalancerFarmsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadBalancerFarmsTasks);
