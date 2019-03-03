import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import ErrorMessage from '../components/ErrorMessage';
import { getLoadBalancers, getLoadBalancersTokens, deleteLoadBalancerToken } from '../requests/LoadBalancerAxios';
import { getLoadBalancersAction, getLoadBalancersTokensAction, deleteLoadBalancerTokenAction } from '../actions/LoadBalancerAction';
import LoadBalancersTable from '../components/LoadBalancersTable';

class LoadBalancerAdmin extends React.Component {

    componentDidMount() {
        this.fetchLoadBalancersAndHandleResult()
    }

    fetchLoadBalancersAndHandleResult = () => {
        getLoadBalancers()
            .then(res => {
                this.props.getLoadBalancersAction({ success: true, data: res.data })
                return true
            })
            .catch(err => {
                this.props.getLoadBalancersAction({ success: false, error: err })
            })
            .then(res => {
                if (res) {
                    return getLoadBalancersTokens()
                }
            })
            .then(res => {
                this.props.getLoadBalancersTokensAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getLoadBalancersTokensAction({ success: false, error: err })
            })
    }

    handleRemoveLBTokenOnClick = (id) => {
        deleteLoadBalancerToken(id)
        .then(res => {
            this.props.deleteLoadBalancerTokenAction({success: true, data: id})
        })
        .catch(err => {
            this.props.deleteLoadBalancerTokenAction({ success: false, error: err })
        })
    }

    render() {

        // in case of error
        if (!this.props.loadBalancerStore.loadBalancers.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                LoadBalancers
                            </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.fetchLoadBalancersAndHandleResult} error={this.props.loadBalancerStore.loadBalancers.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.loadBalancerStore.loadBalancers.data)) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching loadbalancers</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            )
        }

        // render page
        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            LoadBalancers
                            </Header>
                        <Segment attached='bottom' >
                            <LoadBalancersTable handleRemoveLBTokenOnClick={this.handleRemoveLBTokenOnClick} compact="very" rowsPerPage={0} data={this.props.loadBalancerStore.loadBalancers.data} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )

    }
}

function mapStateToProps(state) {
    return {
        loadBalancerStore: state.LoadBalancerReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getLoadBalancersAction,
        getLoadBalancersTokensAction,
        deleteLoadBalancerTokenAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadBalancerAdmin);
