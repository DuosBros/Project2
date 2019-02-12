import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Segment, Message, Icon, Button, Popup } from 'semantic-ui-react';
import _ from 'lodash';

import { getServices } from '../requests/ServiceAxios';
import { getServicesAction } from '../actions/ServiceActions';
import GenericBarChart from '../charts/GenericBarChart';
import ErrorMessage from '../components/ErrorMessage';
import { mapDataForGenericBarChart } from '../utils/HelperFunction';
import ExpandCollapseButtonRow from '../components/ExpandCollapseButtonRow';

class ServicesStatisticsRawDataRow extends React.PureComponent {
    render() {
        return (
            <dl className="dl-horizontal">
                <dt>{this.props.x.name}</dt>
                <dd>{this.props.x.count}</dd>
            </dl>
        )
    }
}

class ServicesStatistics extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expandComponentSteward: false,
            expandLabel: false,
            expandFramework: false
        }
    }
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

    handleExpandCollapseButton = (prop) => {
        this.setState({ [prop]: !this.state[prop] })
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

        var mappedDataOwner = mapDataForGenericBarChart(this.props.serviceStore.services.data, 'Owner', { Status: /^(?!removed$)/i }, true);

        var rawDataOwner = mappedDataOwner.map((x, i) => {
            return (
                <ServicesStatisticsRawDataRow key={i} x={x} />
            )
        })

        var mappedDataResponsibleTeam = mapDataForGenericBarChart(this.props.serviceStore.services.data, 'ResponsibleTeam', { Status: /^(?!removed$)/i });

        if (!this.state.expandComponentSteward) {
            var half_length = Math.ceil(mappedDataResponsibleTeam.length / 2);

            mappedDataResponsibleTeam = mappedDataResponsibleTeam.splice(0, half_length);
        }

        var rawDataResponsibleTeam = mappedDataResponsibleTeam.map((x, i) => {
            return (
                <dl key={i} className="dl-horizontal">
                    <dt>{x.name}</dt>
                    <dd>{x.count}</dd>
                </dl>
            )
        })

        var mappedDataLabel = mapDataForGenericBarChart(this.props.serviceStore.services.data, 'Label', { Status: /^(?!removed$)/i }, true);

        if (!this.state.expandLabel) {
            half_length = Math.ceil(mappedDataLabel.length / 2);

            mappedDataLabel = mappedDataLabel.splice(0, half_length);
        }


        var rawDataLabel = mappedDataLabel.map((x, i) => {
            return (
                <ServicesStatisticsRawDataRow key={i} x={x} />
            )
        })

        var mappedDataFramework = mapDataForGenericBarChart(this.props.serviceStore.services.data, 'Framework', { Status: /^(?!removed$)/i });

        if (!this.state.expandFramework) {
            half_length = Math.ceil(mappedDataFramework.length / 2);

            mappedDataFramework = mappedDataFramework.splice(0, half_length);
        }


        var rawDataFramework = mappedDataFramework.map((x, i) => {
            return (
                <ServicesStatisticsRawDataRow key={i} x={x} />
            )
        })

        var mappedDataDevelopmentFramework = mapDataForGenericBarChart(this.props.serviceStore.services.data, 'DevFramework', { Status: /^(?!removed$)/i });

        var rawDataDevelopmentFramework = mappedDataDevelopmentFramework.map((x, i) => {
            return (
                <ServicesStatisticsRawDataRow key={i} x={x} />
            )
        })

        var mappedDataStatus = mapDataForGenericBarChart(this.props.serviceStore.services.data, 'Status');

        var rawDataStatus = mappedDataStatus.map((x, i) => {
            return (
                <ServicesStatisticsRawDataRow key={i} x={x} />
            )
        })

        // render page
        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Services Statistics - Owner
                        <Popup trigger={
                                <Icon name='question' />
                            } content='Custom filter applied -> Status: /^(?!removed$)/i' inverted />
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
                            <Popup trigger={
                                <Icon name='question' />
                            } content='Custom filter applied -> Status: /^(?!removed$)/i' inverted />
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
                                <ExpandCollapseButtonRow
                                    handleExpandCollapseButton={this.handleExpandCollapseButton}
                                    property="expandComponentSteward"
                                    currentPropertyState={this.state["expandComponentSteward"]} />
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Services Statistics - Label
                            <Popup trigger={
                                <Icon name='question' />
                            } content='Custom filter applied -> Status: /^(?!removed$)/i' inverted />
                        </Header>
                        <Segment attached='bottom' >
                            <Grid stackable>
                                <Grid.Row>
                                    <Grid.Column width={13}>
                                        <GenericBarChart data={mappedDataLabel} />
                                    </Grid.Column>
                                    <Grid.Column width={3} >
                                        {rawDataLabel}
                                    </Grid.Column>
                                </Grid.Row>
                                <ExpandCollapseButtonRow
                                    handleExpandCollapseButton={this.handleExpandCollapseButton}
                                    property="expandLabel"
                                    currentPropertyState={this.state["expandLabel"]} />
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Services Statistics - Framework
                            <Popup trigger={
                                <Icon name='question' />
                            } content='Custom filter applied -> Status: /^(?!removed$)/i' inverted />
                        </Header>
                        <Segment attached='bottom' >
                            <Grid stackable>
                                <Grid.Row>
                                    <Grid.Column width={13}>
                                        <GenericBarChart data={mappedDataFramework} />
                                    </Grid.Column>
                                    <Grid.Column width={3} >
                                        {rawDataFramework}
                                    </Grid.Column>
                                </Grid.Row>
                                <ExpandCollapseButtonRow
                                    handleExpandCollapseButton={this.handleExpandCollapseButton}
                                    property="expandFramework"
                                    currentPropertyState={this.state["expandFramework"]} />
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Services Statistics - Development Framework
                            <Popup trigger={
                                <Icon name='question' />
                            } content='Custom filter applied -> Status: /^(?!removed$)/i' inverted />
                        </Header>
                        <Segment attached='bottom' >
                            <Grid stackable>
                                <Grid.Row>
                                    <Grid.Column width={13}>
                                        <GenericBarChart data={mappedDataDevelopmentFramework} />
                                    </Grid.Column>
                                    <Grid.Column width={3} >
                                        {rawDataDevelopmentFramework}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Services Statistics - Status
                        </Header>
                        <Segment attached='bottom' >
                            <Grid stackable>
                                <Grid.Row>
                                    <Grid.Column width={13}>
                                        <GenericBarChart data={mappedDataStatus} />
                                    </Grid.Column>
                                    <Grid.Column width={3} >
                                        {rawDataStatus}
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

export default connect(mapStateToProps, mapDispatchToProps)(ServicesStatistics);