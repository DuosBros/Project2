import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import _ from 'lodash';

import { getAllLoadBalancerFarms } from '../requests/LoadBalancerFarmsAxios';
import { getAllLoadBalancerFarmsAction } from '../actions/LoadBalancerFarmsAction';
import { mapDataForGenericBarChart, getUniqueValuesOfKey, mapDataForStackedGenericBarChart } from '../utils/HelperFunction';
import ErrorMessage from '../components/ErrorMessage';
import BarChartWithRawData from '../charts/BarChartWithRawData';

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
        this.fetchLoadBalancerFarmsAndHandleResult()
    }

    fetchLoadBalancerFarmsAndHandleResult = () => {
        getAllLoadBalancerFarms()
            .then(res => {
                this.props.getAllLoadBalancerFarmsAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getAllLoadBalancerFarmsAction({ success: false, error: err })
            })
    }

    render() {
        // in case of error
        if (!this.props.loadbalancerFarmsStore.loadBalancerFarms.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                LoadBalancer Farms
                            </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.fetchLoadBalancerFarmsAndHandleResult} error={this.props.loadbalancerFarmsStore.loadBalancerFarms.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.loadbalancerFarmsStore.loadBalancerFarms.data)) {
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

        var mappedLbName = mapDataForGenericBarChart(this.props.loadbalancerFarmsStore.loadBalancerFarms.data, 'LbName');
        var environments = getUniqueValuesOfKey(this.props.loadbalancerFarmsStore.loadBalancerFarms.data, 'Environment');
        var a = mapDataForStackedGenericBarChart(this.props.loadbalancerFarmsStore.loadBalancerFarms.data, 'LbName', environments, 'Environment')
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
                                data={a}
                                stack={environments} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

function mapStateToProps(state) {
    return {
        loadbalancerFarmsStore: state.LoadBalancerFarmsReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAllLoadBalancerFarmsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadBalancerFarmsStatistics);