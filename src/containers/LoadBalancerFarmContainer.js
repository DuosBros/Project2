import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getAllLoadBalancerFarmsAction } from '../utils/actions';
import { ROUTE_LBFARMS, ROUTE_LBFARMS_STATISTICS } from '../utils/constants';
import NotFound from '../pages/NotFound';
import { getAllLoadBalancerFarms } from '../requests/LoadBalancerFarmsAxios';
import LoadBalancerFarms from '../pages/LoadBalancerFarms';
import LoadBalancerFarmsStatistics from '../pages/LoadBalancerFarmsStatistics';

class LoadBalancerFarmContainer extends React.PureComponent {

    componentDidMount() {
        this.fetchAllData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location.key !== this.props.location.key) {
            this.fetchAllData()
        }
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

    fetchAllData = () => {
        let pathname = this.props.location.pathname;
        if (pathname === ROUTE_LBFARMS_STATISTICS || pathname === ROUTE_LBFARMS) {
            this.fetchLoadBalancerFarmsAndHandleResult();
        }
    }

    render() {
        let pathname = this.props.location.pathname;

        if (pathname === ROUTE_LBFARMS) {
            return (
                <LoadBalancerFarms
                    loadBalancerFarms={this.props.loadbalancerFarmsStore.loadBalancerFarms}
                    fetchLoadBalancerFarmsAndHandleResult={this.fetchLoadBalancerFarmsAndHandleResult}
                    fetchPatchGroupsAndHandleResult={this.fetchPatchGroupsAndHandleResult} />
            )
        }
        else if (pathname === ROUTE_LBFARMS_STATISTICS) {
            return (
                <LoadBalancerFarmsStatistics
                    loadBalancerFarms={this.props.loadbalancerFarmsStore.loadBalancerFarms}
                    fetchLoadBalancerFarmsAndHandleResult={this.fetchLoadBalancerFarmsAndHandleResult} />
            )
        }
        else {
            // this shouldnt happen because react-router would throw NotFound component before even reaching here but you know...
            return <NotFound />
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(LoadBalancerFarmContainer);
