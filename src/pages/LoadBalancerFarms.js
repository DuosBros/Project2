import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getAllLoadBalancerFarmsAction } from '../actions/LoadBalancerFarmsAction';
import { getAllLoadBalancerFarms } from '../requests/LoadBalancerFarmsAxios';
import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import LoadBalancerFarmsTable from '../components/LoadBalancerFarmsTable';

class LoadBalancerFarms extends React.Component {

    componentDidMount() {
        getAllLoadBalancerFarms()
            .then(res => {
                this.props.getAllLoadBalancerFarmsAction(res.data)
                console.log(res.data)
            })
    }
    render() {
        if (this.props.loadbalancerFarmsStore.loadBalancerFarms === null) {
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
        else {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                LoadBalancer Farms
                            </Header>
                            <Segment attached='bottom' >
                                <LoadBalancerFarmsTable compact="very" defaultLimitOverride={45} data={this.props.loadbalancerFarmsStore.loadBalancerFarms} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
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

export default connect(mapStateToProps, mapDispatchToProps)(LoadBalancerFarms);
