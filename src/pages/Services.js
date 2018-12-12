import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import { getServices } from '../requests/ServiceAxios';
import { getServicesAction } from '../actions/ServiceActions';
import ServiceTable from '../components/ServiceTable';

class Services extends React.Component {

    componentDidMount() {
        getServices()
            .then(res => {
                this.props.getServicesAction(res.data)
            })
    }
    render() {
        console.log(this.props.serviceStore.services)
        if (this.props.serviceStore.services === null) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching services</Message.Header>
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
                                Services
                            </Header>
                            <Segment attached='bottom' >
                                <ServiceTable defaultLimitOverride={50} data={this.props.serviceStore.services} />
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
        serviceStore: state.ServiceReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getServicesAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Services);
