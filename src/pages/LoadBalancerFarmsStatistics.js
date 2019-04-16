import React from 'react';
import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import _ from 'lodash';

import { mapDataForGenericChart, getUniqueValuesOfKey, mapDataForStackedGenericBarChart } from '../utils/HelperFunction';
import ErrorMessage from '../components/ErrorMessage';
import BarChartWithRawData from '../charts/BarChartWithRawData';
import PieChartWithRawData from '../charts/PieChartWIthRawData';
import { APP_TITLE } from '../appConfig';

let rawDataStyle = {
    dt: {
        width: '240px'
    },
    dd: {
        marginLeft: '260px'
    }
}

class LoadBalancerFarmsStatistics extends React.Component {

    componentDidMount() {
        document.title = APP_TITLE + "LoadBalancerFarms Statistics"
    }

    render() {
        // in case of error
        if (!this.props.loadBalancerFarms.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                LoadBalancer Farms
                            </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.props.fetchLoadBalancerFarmsAndHandleResult} error={this.props.loadBalancerFarms.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.loadBalancerFarms.data)) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching loadbalancer farms</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            )
        }

        var mappedLbName = mapDataForGenericChart(this.props.loadBalancerFarms.data, 'LbName');
        var environments = getUniqueValuesOfKey(this.props.loadBalancerFarms.data, 'Environment');
        var mappedDataEnvironmentsPerLB = mapDataForStackedGenericBarChart(this.props.loadBalancerFarms.data, 'LbName', environments, 'Environment')
        var mappedDataPerDataCenter = mapDataForGenericChart(this.props.loadBalancerFarms.data, 'DataCenter')
        var mappedDataPerEnvironment = mapDataForGenericChart(this.props.loadBalancerFarms.data, 'Environment')
        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            LoadBalancer Farms Statistics - LBName
                            </Header>
                        <Segment attached='bottom' >
                            <BarChartWithRawData
                                rawDataStyle={rawDataStyle}
                                barChartWidth={12}
                                rawDataWidth={4}
                                data={mappedLbName} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            LoadBalancer Farms Statistics - Environments per LB
                            </Header>
                        <Segment attached='bottom' >
                            <BarChartWithRawData
                                rawDataStyle={rawDataStyle}
                                barChartWidth={12}
                                rawDataWidth={4}
                                data={mappedDataEnvironmentsPerLB}
                                stack={environments} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            LoadBalancer Farms Statistics - Per Datacenter
                            </Header>
                        <Segment attached='bottom' >
                            <PieChartWithRawData
                                barChartWidth={12}
                                rawDataWidth={4}
                                data={mappedDataPerDataCenter} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            LoadBalancer Farms Statistics - Per Environment
                            </Header>
                        <Segment attached='bottom' >
                            <PieChartWithRawData
                                barChartWidth={12}
                                rawDataWidth={4}
                                data={mappedDataPerEnvironment} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default LoadBalancerFarmsStatistics;