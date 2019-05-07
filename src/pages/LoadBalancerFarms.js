import React from 'react';
import _ from 'lodash';

import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import LoadBalancerFarmsTable from '../components/LoadBalancerFarmsTable';
import ErrorMessage from '../components/ErrorMessage';
import { APP_TITLE } from '../appConfig';

class LoadBalancerFarms extends React.Component {

    componentDidMount() {
        document.title = APP_TITLE + "LoadBalancerFarms"
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

        // render page
        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            LoadBalancer Farms
                            </Header>
                        <Segment attached='bottom' >
                            <LoadBalancerFarmsTable compact="very" rowsPerPage={45} data={this.props.loadBalancerFarms.data} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default LoadBalancerFarms;
