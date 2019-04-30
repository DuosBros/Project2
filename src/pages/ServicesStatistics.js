import React from 'react';
import { Grid, Header, Segment, Message, Icon, Popup } from 'semantic-ui-react';
import _ from 'lodash';

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
        document.title = APP_TITLE + "Services Statistics"
    }

    handleExpandCollapseButton = (prop) => {
        this.setState({ [prop]: !this.state[prop] })
    }

    render() {
        // in case of error
        if (!this.props.services.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Services Statistics
                            </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.fetchServicesAndHandleResult} error={this.props.services.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            );
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.services.data)) {
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

        var mappedDataOwner = mapDataForGenericChart(this.props.services.data, 'Owner', { Status: /^(?!removed$)/i }, true);

        var mappedDataComponentSteward = mapDataForGenericChart(this.props.services.data, 'ResponsibleTeam', { Status: /^(?!removed$)/i });

        if (!this.state.expandComponentSteward) {
            var half_length = Math.ceil(mappedDataComponentSteward.length / 2);

            mappedDataComponentSteward = mappedDataComponentSteward.splice(0, half_length);
        }

        var mappedDataLabel = mapDataForGenericChart(this.props.services.data, 'Label', { Status: /^(?!removed$)/i }, true);

        if (!this.state.expandLabel) {
            half_length = Math.ceil(mappedDataLabel.length / 2);

            mappedDataLabel = mappedDataLabel.splice(0, half_length);
        }

        var mappedDataFramework = mapDataForGenericChart(this.props.services.data, 'Framework', { Status: /^(?!removed$)/i });

        if (!this.state.expandFramework) {
            half_length = Math.ceil(mappedDataFramework.length / 2);

            mappedDataFramework = mappedDataFramework.splice(0, half_length);
        }

        var mappedDataDevelopmentFramework = mapDataForGenericChart(this.props.services.data, 'DevFramework', { Status: /^(?!removed$)/i });

        var mappedDataStatus = mapDataForGenericChart(this.props.services.data, 'Status');

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

export default ServicesStatistics;