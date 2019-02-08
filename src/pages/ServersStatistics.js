import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import _ from 'lodash';

import { getServices } from '../requests/ServiceAxios';
import { getServicesAction } from '../actions/ServiceActions';
import GenericBarChart from '../charts/GenericBarChart';
import ErrorMessage from '../components/ErrorMessage';
import { mapDataForGenericBarChart } from '../utils/HelperFunction';

class ServersStatistics extends React.Component {

    componentDidMount() {
        this.fetchServicesAndHandleResult()
    }

    fetchServicesAndHandleResult = () => {
        getServices()
            .then(res => {
                this.props.getServicesAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getServicesAction({ success: false, error: err })
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
                                Services Statistics
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

        var mappedDataOwner = mapDataForGenericBarChart(this.props.serviceStore.services.data, 'Owner');

        var rawDataOwner = mappedDataOwner.map((x, i) => {
            return (
                <dl key={i} className="dl-horizontal">
                    <dt>{x.name}</dt>
                    <dd>{x.count}</dd>
                </dl>
            )
        })

        var mappedDataResponsibleTeam = mapDataForGenericBarChart(this.props.serviceStore.services.data, 'ResponsibleTeam');

        var rawDataResponsibleTeam = mappedDataResponsibleTeam.map((x, i) => {
            return (
                <dl key={i} className="dl-horizontal">
                    <dt>{x.name}</dt>
                    <dd>{x.count}</dd>
                </dl>
            )
        })

        // render page
        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Services Statistics - Owner
                            </Header>
                        <Segment attached='bottom' >
                            <Grid stackable>
                                <Grid.Row>
                                    <Grid.Column width={13}>
                                        <GenericBarChart data={mappedDataOwner} />
                                    </Grid.Column>
                                    <Grid.Column width={3} >
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
                            Services Statistics - Component Steward
                        </Header>
                        <Segment attached='bottom' >
                            <Grid stackable>
                                <Grid.Row>
                                    <Grid.Column width={13}>
                                        <GenericBarChart data={mappedDataResponsibleTeam} />
                                    </Grid.Column>
                                    <Grid.Column width={3} >
                                        {rawDataResponsibleTeam}
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
        serviceStore: state.ServiceReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getServicesAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ServersStatistics);