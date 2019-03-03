import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import { getServices, getHighAvailabilities } from '../requests/ServiceAxios';
import { getServicesAction, getHighAvailabilitiesAction } from '../actions/ServiceActions';
import ServiceTable from '../components/ServiceTable';
import ErrorMessage from '../components/ErrorMessage';
import { APP_TITLE } from '../appConfig';

class Services extends React.Component {

    componentDidMount() {
        this.fetchServicesAndHandleResult()

        document.title = APP_TITLE + "Services"
    }

    fetchServicesAndHandleResult = () => {
        getServices()
            .then(res => {
                this.props.getServicesAction({ success: true, data: res.data })
                return true;
            })
            .catch(err => {
                this.props.getServicesAction({ success: false, error: err })
            })
            .then(res => {
                if (res) {
                    getHighAvailabilities()
                        .then(res => {
                            this.props.getHighAvailabilitiesAction({ success: true, data: res.data })
                        })
                        .catch(err => {
                            this.props.getHighAvailabilitiesAction({ success: false, error: err })
                        })
                }
            })
    }

    render() {

        // in case of error
        if (!this.props.serviceStore.services.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Services
                            </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.fetchServicesAndHandleResult} error={this.props.serviceStore.services.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            );
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.serviceStore.services.data)) {
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

        // render page
        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Services
                            </Header>
                        <Segment attached='bottom' >
                            <ServiceTable rowsPerPage={50} data={this.props.serviceStore.services.data} compact="very" />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

function mapStateToProps(state) {
    return {
        serviceStore: state.ServiceReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getServicesAction,
        getHighAvailabilitiesAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Services);
