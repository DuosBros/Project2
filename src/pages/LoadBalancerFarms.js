import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { getAllLoadBalancerFarmsAction } from '../utils/actions';
import { getAllLoadBalancerFarms } from '../requests/LoadBalancerFarmsAxios';
import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import LoadBalancerFarmsTable from '../components/LoadBalancerFarmsTable';
import ErrorMessage from '../components/ErrorMessage';
import { APP_TITLE } from '../appConfig';

class LoadBalancerFarms extends React.Component {

    componentDidMount() {
        this.fetchLoadBalancerFarmsAndHandleResult()

        document.title = APP_TITLE + "LoadBalancerFarms"
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

        // render page
        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            LoadBalancer Farms
                            </Header>
                        <Segment attached='bottom' >
                            <LoadBalancerFarmsTable compact="very" rowsPerPage={45} data={this.props.loadbalancerFarmsStore.loadBalancerFarms.data} />
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

export default connect(mapStateToProps, mapDispatchToProps)(LoadBalancerFarms);
