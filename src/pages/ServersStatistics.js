import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Segment, Message, Icon, Popup, Dropdown, Form } from 'semantic-ui-react';
import _ from 'lodash';

import { getServers } from '../requests/ServerAxios';
import { getVirtualMachines } from '../requests/VirtualMachineAxios';
import { getVirtualMachinesAction, getServersAction } from '../utils/actions';
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
        this.fetchServersAndHandleResult()
        this.fetchVirtualMachinesAndHandleResult()

        document.title = APP_TITLE + "Servers Statistics"
    }

    fetchServersAndHandleResult = () => {
        getServers()
            .then(res => {
                this.props.getServersAction(
                    {
                        success: true,
                        data: res.data
                    })
            })
            .catch(err => {
                this.props.getServersAction({ success: false, error: err })
            })
    }

    fetchVirtualMachinesAndHandleResult = () => {
        getVirtualMachines()
            .then(res => {
                this.props.getVirtualMachinesAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getVirtualMachinesAction({ success: false, error: err })
            })
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
                            options={Object.keys(this.props.serverStore.servers.data[0]).map(x =>
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
                        options={Object.keys(this.props.serverStore.servers.data[0]).map(x =>
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
        if (!this.props.serverStore.servers.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Servers
                            </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.fetchServersAndHandleResult} error={this.props.serverStore.servers.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.serverStore.servers.data)) {
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
        if (!this.props.virtualMachineStore.virtualMachines.data && this.props.virtualMachineStore.virtualMachines.success) {
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

        var mappedDataOwner = mapDataForGenericChart(this.props.serverStore.servers.data, 'ServerOwner');

        var mappedDataOperatingSystem = mapDataForGenericChart(this.props.serverStore.servers.data, 'OperatingSystem');

        var mappedDataEnvironment = mapDataForGenericChart(this.props.serverStore.servers.data, 'Environment');

        var mappedDataDataCenter = mapDataForGenericChart(this.props.serverStore.servers.data, 'DataCenter');

        var mappedDataVirtualCloud;
        if (this.props.virtualMachineStore.virtualMachines.success) {
            mappedDataVirtualCloud = mapDataForGenericChart(this.props.virtualMachineStore.virtualMachines.data, 'Cloud', { Cloud: /^LO_/i });
        }

        var counter = 0;
        var mappedCombinedData = [];
        var pieChart = null;
        this.state.inputs.forEach(() => counter++)
        if (counter === 3) {
            var data = this.props.serverStore.servers.data.filter(x => x[this.state.inputs[0]] === this.state.inputs[2])
            mappedCombinedData = mapDataForGenericChart(data, this.state.inputs[1]);

            pieChart = (
                <PieChartWithRawData
                    barChartWidth={12}
                    rawDataWidth={4}
                    data={mappedCombinedData} />
            )
        }

        var options = Object.keys(this.props.serverStore.servers.data[0]).map(x =>
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
                                options={getUniqueValuesOfKey(this.props.serverStore.servers.data, this.state.inputs[0]).slice(0, 15).map(x =>
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

function mapStateToProps(state) {
    return {
        serverStore: state.ServerReducer,
        virtualMachineStore: state.VirtualMachineReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getServersAction,
        getVirtualMachinesAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ServersStatistics);