import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import _ from 'lodash';

import { getServers } from '../requests/ServerAxios';
import { getServersAction } from '../actions/ServerActions';
import { getVirtualMachines } from '../requests/VirtualMachineAxios';
import { getVirtualMachinesAction } from '../actions/VirtualMachineAction';
import GenericBarChart from '../charts/GenericBarChart';
import ErrorMessage from '../components/ErrorMessage';
import { mapDataForGenericBarChart } from '../utils/HelperFunction';

class ServersStatistics extends React.Component {

    componentDidMount() {
        this.fetchServersAndHandleResult()
        this.fetchVirtualMachinesAndHandleResult()
    }

    fetchServersAndHandleResult = () => {
        getServers()
            .then(res => {
                this.props.getServersAction(
                    {
                        success: true,
                        data: res.data
                    })
            })
            .catch(err => {
                this.props.getServersAction({ success: false, error: err })
            })
    }

    fetchVirtualMachinesAndHandleResult = () => {
        getVirtualMachines()
            .then(res => {
                this.props.getVirtualMachinesAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getVirtualMachinesAction({ success: false, error: err })
            })
    }

    render() {
        // in case of error
        if (!this.props.serverStore.servers.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Servers
                            </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.fetchServersAndHandleResult} error={this.props.serverStore.servers.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.serverStore.servers.data)) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching servers</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            )
        }

        // in case it's still loading data
        if (!this.props.virtualMachineStore.virtualMachines.data && this.props.virtualMachineStore.virtualMachines.succes) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching virtual machines</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            )
        }

        var mappedDataOwner = mapDataForGenericBarChart(this.props.serverStore.servers.data, 'ServerOwner');

        var rawDataOwner = mappedDataOwner.map((x, i) => {
            return (
                <dl key={i} className="dl-horizontal">
                    <dt>{x.name}</dt>
                    <dd>{x.count}</dd>
                </dl>
            )
        })

        var mappedDataOperatingSystem = mapDataForGenericBarChart(this.props.serverStore.servers.data, 'OperatingSystem');

        var rawDataOperatingSystem = mappedDataOperatingSystem.map((x, i) => {
            return (
                <dl key={i} className="dl-horizontal">
                    <dt>{x.name}</dt>
                    <dd>{x.count}</dd>
                </dl>
            )
        })

        var mappedDataEnvironment = mapDataForGenericBarChart(this.props.serverStore.servers.data, 'Environment');

        var rawDataEnvironment = mappedDataEnvironment.map((x, i) => {
            return (
                <dl key={i} className="dl-horizontal">
                    <dt>{x.name}</dt>
                    <dd>{x.count}</dd>
                </dl>
            )
        })

        var mappedDataDataCenter = mapDataForGenericBarChart(this.props.serverStore.servers.data, 'DataCenter');

        var rawDataDataCenter = mappedDataDataCenter.map((x, i) => {
            return (
                <dl key={i} className="dl-horizontal">
                    <dt>{x.name}</dt>
                    <dd>{x.count}</dd>
                </dl>
            )
        })

        var mappedDataVirtualCloud, rawDataVirtualCloud;
        if (this.props.virtualMachineStore.virtualMachines.success) {
            mappedDataVirtualCloud = mapDataForGenericBarChart(this.props.virtualMachineStore.virtualMachines.data, 'Cloud');

            rawDataVirtualCloud = mappedDataVirtualCloud.map((x, i) => {
                return (
                    <dl key={i} className="dl-horizontal">
                        <dt>{x.name}</dt>
                        <dd>{x.count}</dd>
                    </dl>
                )
            })
        }


        // render page
        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Server Statistics - Owner
                            </Header>
                        <Segment attached='bottom' >
                            <Grid stackable>
                                <Grid.Row>
                                    <Grid.Column width={11}>
                                        <GenericBarChart data={mappedDataOwner} />
                                    </Grid.Column>
                                    <Grid.Column width={5} >
                                        {rawDataOwner}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Server Statistics - Operating System
                        </Header>
                        <Segment attached='bottom' >
                            <Grid stackable>
                                <Grid.Row>
                                    <Grid.Column width={11}>
                                        <GenericBarChart data={mappedDataOperatingSystem} />
                                    </Grid.Column>
                                    <Grid.Column width={5} >
                                        {rawDataOperatingSystem}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Server Statistics - Environment
                        </Header>
                        <Segment attached='bottom' >
                            <Grid stackable>
                                <Grid.Row>
                                    <Grid.Column width={11}>
                                        <GenericBarChart data={mappedDataEnvironment} />
                                    </Grid.Column>
                                    <Grid.Column width={5} >
                                        {rawDataEnvironment}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Server Statistics - DataCenter
                        </Header>
                        <Segment attached='bottom' >
                            <Grid stackable>
                                <Grid.Row>
                                    <Grid.Column width={11}>
                                        <GenericBarChart data={mappedDataDataCenter} />
                                    </Grid.Column>
                                    <Grid.Column width={5} >
                                        {rawDataDataCenter}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Server Statistics - Virtual Cloud
                        </Header>
                        <Segment attached='bottom' >
                            <Grid stackable>
                                <Grid.Row>
                                    <Grid.Column width={11}>
                                        {
                                            !this.props.virtualMachineStore.virtualMachines.success ?
                                                <ErrorMessage
                                                    handleRefresh={this.fetchVirtualMachinesAndHandleResult}
                                                    error={this.props.virtualMachineStore.virtualMachines.error} />
                                                : <GenericBarChart data={mappedDataVirtualCloud} />
                                        }
                                    </Grid.Column>
                                    <Grid.Column width={5} >
                                        {rawDataVirtualCloud}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

function mapStateToProps(state) {
    return {
        serverStore: state.ServerReducer,
        virtualMachineStore: state.VirtualMachineReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getServersAction,
        getVirtualMachinesAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ServersStatistics);