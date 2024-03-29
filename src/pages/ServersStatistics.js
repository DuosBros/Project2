import React from 'react';
import { Grid, Header, Segment, Message, Icon, Popup, Dropdown, Form } from 'semantic-ui-react';
import _ from 'lodash';

import ErrorMessage from '../components/ErrorMessage';
import { mapDataForGenericChart, getUniqueValuesOfKey } from '../utils/HelperFunction';
import BarChartWithRawData from '../charts/BarChartWithRawData';
import PieChartWithRawData from '../charts/PieChartWIthRawData';
import { APP_TITLE } from '../appConfig';

const DropDownForCombinedPieChart = (props) => {
    return (
        <>
            <label><Icon name='add' />{props.label}</label>
            <Dropdown
                className='leftMargin bottomMargin rightMargin'
                selection
                onChange={(e, m) => props.handlePropertyDropdownOnChange(e, m, props.index)}
                options={props.options}
                selectOnBlur={false}
                selectOnNavigation={false}
                placeholder='Type to search & add...'
                search
            />
        </>
    )
}
let rawDataStyle = {
    dt: {
        width: '240px'
    },
    dd: {
        marginLeft: '260px'
    }
}
class ServersStatistics extends React.Component {

    state = {
        inputs: []
    }
    componentDidMount() {
        document.title = APP_TITLE + "Servers Statistics"
    }

    handlePropertyDropdownOnChange = (e, { value }, i) => {
        var o = Object.assign([], this.state.inputs)
        o[i] = value;
        this.setState({ inputs: o });
    }

    renderInputsForCombinationBarChart = () => {
        var result = [];

        // map existing inputs
        result = this.state.inputs.map((input, i) => {
            return (
                <React.Fragment key={i}>
                    <Form.Field>
                        <label><Icon name='add' />Property Name</label>
                        <Dropdown
                            className='leftMargin bottomMargin'
                            value={input}
                            selection
                            onChange={(e, m) => this.handlePropertyDropdownOnChange(e, m, i)}
                            options={Object.keys(this.props.servers.data[0]).map(x =>
                                ({
                                    value: x,
                                    text: x
                                })
                            )}

                            selectOnBlur={false}
                            selectOnNavigation={false}
                            placeholder='Type to search & add...'
                            search
                        />
                        <Popup trigger={
                            <Icon name='remove' />
                        } content='Remove property' inverted />

                    </Form.Field>
                </React.Fragment>
            )
        })

        let i = this.state.inputs.length;

        result.push(
            <React.Fragment key={i}>
                <Form.Field>
                    <label><Icon name='add' />Property Name</label>
                    <Dropdown
                        className='leftMargin bottomMargin'
                        selection
                        onChange={(e, m) => this.handlePropertyDropdownOnChange(e, m, i)}
                        options={Object.keys(this.props.servers.data[0]).map(x =>
                            ({
                                value: x,
                                text: x
                            })
                        )}

                        selectOnBlur={false}
                        selectOnNavigation={false}
                        placeholder='Type to search & add...'
                        search
                    />
                </Form.Field>
            </React.Fragment>
        )

        return result;
    }

    render() {
        // in case of error
        if (!this.props.servers.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Servers
                            </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.props.fetchServersAndHandleResult} error={this.props.servers.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.servers.data)) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching servers</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            )
        }

        // in case it's still loading data
        if (!this.props.virtualMachines.data && this.props.virtualMachines.success) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching virtual machines</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            )
        }

        var mappedDataOwner = mapDataForGenericChart(this.props.servers.data, 'ServerOwner');

        var mappedDataOperatingSystem = mapDataForGenericChart(this.props.servers.data, 'OperatingSystem');

        var mappedDataEnvironment = mapDataForGenericChart(this.props.servers.data, 'Environment');

        var mappedDataDataCenter = mapDataForGenericChart(this.props.servers.data, 'DataCenter');

        var mappedDataVirtualCloud;
        if (this.props.virtualMachines.success) {
            mappedDataVirtualCloud = mapDataForGenericChart(this.props.virtualMachines.data, 'Cloud', { Cloud: /^LO_/i });
        }

        var counter = 0;
        var mappedCombinedData = [];
        var pieChart = null;
        this.state.inputs.forEach(() => counter++)
        if (counter === 3) {
            var data = this.props.servers.data.filter(x => x[this.state.inputs[0]] === this.state.inputs[2])
            mappedCombinedData = mapDataForGenericChart(data, this.state.inputs[1]);

            pieChart = (
                <PieChartWithRawData
                    barChartWidth={12}
                    rawDataWidth={4}
                    data={mappedCombinedData} />
            )
        }

        var options = Object.keys(this.props.servers.data[0]).map(x =>
            ({
                value: x,
                text: x
            })
        )

        // render page
        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Server Statistics - Owner
                            </Header>
                        <Segment attached='bottom' >
                            <BarChartWithRawData
                                rawDataStyle={rawDataStyle}
                                barChartWidth={12}
                                rawDataWidth={4}
                                data={mappedDataOwner} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Server Statistics - Operating System
                        </Header>
                        <Segment attached='bottom' >
                            <BarChartWithRawData
                                rawDataStyle={rawDataStyle}
                                barChartWidth={12}
                                rawDataWidth={4}
                                data={mappedDataOperatingSystem} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Server Statistics - Environment
                        </Header>
                        <Segment attached='bottom' >
                            <BarChartWithRawData
                                rawDataStyle={rawDataStyle}
                                barChartWidth={12}
                                rawDataWidth={4}
                                data={mappedDataEnvironment} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Server Statistics - DataCenter
                        </Header>
                        <Segment attached='bottom' >
                            <BarChartWithRawData
                                rawDataStyle={rawDataStyle}
                                barChartWidth={12}
                                rawDataWidth={4}
                                data={mappedDataDataCenter} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Server Statistics - Virtual Cloud
                        <Popup trigger={
                                <Icon name='question' />
                            } content='Custom filter applied -> Cloud: /^LO_/i' inverted />
                        </Header>
                        <Segment attached='bottom' >
                            <BarChartWithRawData
                                rawDataStyle={rawDataStyle}
                                barChartWidth={12}
                                rawDataWidth={4}
                                data={mappedDataVirtualCloud} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Server Statistics - Custom combination
                        <Popup trigger={
                                <Icon name='question' />
                            } content='You can combine and draw the chart using more properties' inverted />
                        </Header>
                        <Segment attached='bottom' >
                            <DropDownForCombinedPieChart
                                handlePropertyDropdownOnChange={this.handlePropertyDropdownOnChange}
                                options={options}
                                index={0}
                                label="Property Name" />
                            <DropDownForCombinedPieChart
                                handlePropertyDropdownOnChange={this.handlePropertyDropdownOnChange}
                                options={getUniqueValuesOfKey(this.props.servers.data, this.state.inputs[0]).slice(0, 15).map(x =>
                                    ({
                                        value: x,
                                        text: x
                                    })
                                ).sort((a, b) => a.value - b.value)}
                                index={2}
                                label="Property Value" />
                            <br />
                            <DropDownForCombinedPieChart
                                handlePropertyDropdownOnChange={this.handlePropertyDropdownOnChange}
                                options={options}
                                index={1}
                                label="Property Name" />
                            {pieChart}
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default ServersStatistics;