import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Segment, Message, Icon, Popup } from 'semantic-ui-react';
import _ from 'lodash';

import { getServices } from '../requests/ServiceAxios';
import { getServicesAction } from '../actions/ServiceActions';
import ErrorMessage from '../components/ErrorMessage';
import { mapDataForGenericChart } from '../utils/HelperFunction';
import BarChartWithRawData from '../charts/BarChartWithRawData';
import { APP_TITLE } from '../appConfig';

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

        document.title = APP_TITLE + "Services Statistics"
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

        var mappedDataOwner = mapDataForGenericChart(this.props.serviceStore.services.data, 'Owner', { Status: /^(?!removed$)/i }, true);

        var mappedDataComponentSteward = mapDataForGenericChart(this.props.serviceStore.services.data, 'ResponsibleTeam', { Status: /^(?!removed$)/i });

        if (!this.state.expandComponentSteward) {
            var half_length = Math.ceil(mappedDataComponentSteward.length / 2);

            mappedDataComponentSteward = mappedDataComponentSteward.splice(0, half_length);
        }

        var mappedDataLabel = mapDataForGenericChart(this.props.serviceStore.services.data, 'Label', { Status: /^(?!removed$)/i }, true);

        if (!this.state.expandLabel) {
            half_length = Math.ceil(mappedDataLabel.length / 2);

            mappedDataLabel = mappedDataLabel.splice(0, half_length);
        }

        var mappedDataFramework = mapDataForGenericChart(this.props.serviceStore.services.data, 'Framework', { Status: /^(?!removed$)/i });

        if (!this.state.expandFramework) {
            half_length = Math.ceil(mappedDataFramework.length / 2);

            mappedDataFramework = mappedDataFramework.splice(0, half_length);
        }

        var mappedDataDevelopmentFramework = mapDataForGenericChart(this.props.serviceStore.services.data, 'DevFramework', { Status: /^(?!removed$)/i });

        var mappedDataStatus = mapDataForGenericChart(this.props.serviceStore.services.data, 'Status');

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
                            <BarChartWithRawData
                                barChartWidth={13}
                                rawDataWidth={3}
                                data={mappedDataOwner} />
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
                            <BarChartWithRawData
                                barChartWidth={13}
                                rawDataWidth={3}
                                data={mappedDataComponentSteward}
                                expandCollapseButtonProps={{
                                    name: 'expandComponentSteward',
                                    currentState: this.state["expandComponentSteward"],
                                    handleExpandCollapseButton: this.handleExpandCollapseButton
                                }} />
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
                            <BarChartWithRawData
                                filterUnknown={true}
                                barChartWidth={13}
                                rawDataWidth={3}
                                data={mappedDataLabel}
                                expandCollapseButtonProps={{
                                    name: 'expandLabel',
                                    currentState: this.state["expandLabel"],
                                    handleExpandCollapseButton: this.handleExpandCollapseButton
                                }} />
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
                            <BarChartWithRawData
                                barChartWidth={13}
                                rawDataWidth={3}
                                data={mappedDataFramework}
                                expandCollapseButtonProps={{
                                    name: 'expandFramework',
                                    currentState: this.state["expandFramework"],
                                    handleExpandCollapseButton: this.handleExpandCollapseButton
                                }} />
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
                            <BarChartWithRawData
                                barChartWidth={13}
                                rawDataWidth={3}
                                data={mappedDataDevelopmentFramework} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Services Statistics - Status
                        </Header>
                        <Segment attached='bottom' >
                            <BarChartWithRawData
                                barChartWidth={13}
                                rawDataWidth={3}
                                data={mappedDataStatus} />
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