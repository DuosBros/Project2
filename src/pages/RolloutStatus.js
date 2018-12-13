import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { getDismeApplicationsAction, getServiceDetailsByShortcutsAction, removeServiceDetailsAction, getRolloutStatusAction } from '../actions/RolloutStatusActions';
import { getDismeApplications, getServiceByShortcut } from '../requests/ServiceAxios';
import { Grid, Header, Segment, Dropdown, Input, Table, Button, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import DismeStatus from '../components/DismeStatus';
import { DISME_SERVICE_URL, DISME_SERVICE_PLACEHOLDER } from '../appConfig';
import SimpleTable from '../components/SimpleTable';
import { searchServiceShortcut } from '../requests/HeaderAxios';
import { searchServiceShortcutAction } from '../actions/HeaderActions';
import { debounce, sleep } from '../utils/HelperFunction';
import { getRolloutStatus } from '../requests/RolloutStatusAxios';

class RolloutStatus extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dismeApplicationsFiltered: [],
            inputProductsValues: "",
            selectedServices: [],
            loadingServiceDetails: false,
            dropdownValue: "",
            getServiceDetailsError: {}

        }

        this.getServiceDetailsAndRolloutStatus = this.getServiceDetailsAndRolloutStatus.bind(this);
        this.getServiceDetailsAndRolloutStatus = debounce(this.getServiceDetailsAndRolloutStatus, 150);
        this.handleSearchServiceShortcut = this.handleSearchServiceShortcut.bind(this);
        this.handleSearchServiceShortcut = debounce(this.handleSearchServiceShortcut, 150);
    }

    componentDidMount() {
        getDismeApplications()
            .then(res => {
                this.props.getDismeApplicationsAction(res.data.map(x =>
                    ({
                        text: x.Application,
                        value: x.Application,
                        services: x.Service
                    })))
            })
    }

    handleDropdownOnChange = (e, { value }) => {

        this.setState({ loadingServiceDetails: true, dropdownValue: value });
        var filteredApps = this.props.rolloutStatusStore.dismeApplications.filter(x => x.value === value);

        var shortcuts = filteredApps.map(x => x.services.map(y => y.Shortcut))[0];

        var joinedShortcuts = shortcuts.join(",")

        this.setState({
            inputProductsValues: joinedShortcuts
            // selectedProducts: filteredApps[0].services
        });

        this.getServiceDetailsAndRolloutStatus(joinedShortcuts)

        // this.getRolloutStatus(filteredApps[0].services);
    }

    handleOnSearchChange = (e) => {
        if (e.target.value.length > 1) {

            var filtered = this.props.rolloutStatusStore.dismeApplications.filter(x => x.text.toString().search(new RegExp(x.text, "i")) >= 0)
            this.setState({ dismeApplicationsFiltered: filtered });
        }
    }

    // getRolloutStatus(services) {
    //     var ids = services.map(x => x.Id)
    // }

    handleInputOnChange = (e, { value }) => {

        this.setState({ inputProductsValues: value });

        this.getServiceDetailsAndRolloutStatus(value)
    }

    getServiceDetailsAndRolloutStatus(services) {
        getServiceByShortcut(services)
            .then(res => {
                if (res.data) {
                    this.props.getServiceDetailsByShortcutsAction(res.data)
                }
                else {
                    this.props.getServiceDetailsByShortcutsAction([])
                }

                this.setState({ loadingServiceDetails: false });
            })
            // .catch(err => {
            //     this.setState({
            //         loadingServiceDetails: false,
            //         getServiceDetailsError: err
            //     });
            // })
            .then(() => {
                var split = services.split(",")

                for (let i = 0; i < split.length; i++) {

                    sleep(500).then(() => {
                        getRolloutStatus(split[i])
                            .then(res => {
                                // console.log(this.props.rolloutStatusStore.serviceDetails)
                                for (let i = 0; i < this.props.rolloutStatusStore.serviceDetails.length; i++) {
                                    var found = false;
                                    var element = this.props.rolloutStatusStore.serviceDetails[i];
                                    if (element !== null) {
                                        if (element.Service[0].Shortcut.search(new RegExp(split[i], "i")) >= 0) {
                                            found = true;
                                            break;
                                        }
                                    }
                                }

                                if (res.data && found) {
                                    var object = {
                                        serviceName: split[i],
                                        rolloutStatus: res.data
                                    }
                                    this.props.getRolloutStatusAction(object)
                                }
                            })
                            .catch(err => {
                                var object = {
                                    serviceName: split[i],
                                    err: err
                                }
                                this.props.getRolloutStatusAction(object)
                            })
                    })
                }
            })
    }

    handleSearchServiceShortcut(value) {
        searchServiceShortcut(value)
            .then(res => {
                this.props.searchServiceShortcutAction(res.data.map(e => ({ text: e.Name, value: e.Id })))
            })
    }

    handleServiceShortcutSearchChange = (e) => {
        if (e.target.value.length > 1) {
            this.handleSearchServiceShortcut(e.target.value)
        }
    }

    handleServiceChange = (e, m) => {
        var value = m.options.find(x => x.value === m.value).text;

        this.setState({ inputProductsValues: this.state.inputProductsValues + "," + value });
        this.getServiceDetailsAndRolloutStatus(this.state.inputProductsValues)
    }

    handleGetRolloutStatusOnClick = () => {
        // var splitted = this.state.inputProductsValues.split(",")

        getServiceByShortcut(this.state.inputProductsValues)
            .then(res => {
                this.props.getServiceDetailsByShortcutsAction(res.data)
            })
    }

    removeServiceFromSearch = (service) => {
        var split = this.state.inputProductsValues.split(",")

        var filtered = split.filter(x => x !== service.Shortcut)

        this.setState({ inputProductsValues: filtered.join(",") });

        this.props.removeServiceDetailsAction(service);
    }

    render() {
        // console.log(this.props.rolloutStatusStore.serviceDetails)
        console.log(this.props.rolloutStatusStore.rolloutStatuses)

        var serviceTableColumnProperties = [
            {
                name: "Name",
                width: 4,
            },
            {
                name: "Shortcut",
                width: 4,
            },
            {
                name: "Status",
                width: 3
            },
            {
                name: "Disme",
                width: 1,
            },
            {
                name: "# Servers",
                width: 2
            },
            {
                name: "Remove from List",
                width: 2
            }
        ];

        var servicesTableRows;

        if (!_.isEmpty(this.state.getServiceDetailsError)) {
            console.log(this.state.getServiceDetailsError)
            servicesTableRows = (
                <Table.Row error>
                    <Table.Cell colSpan={6}>Error fetching data</Table.Cell>
                </Table.Row>
            )
        }
        else {
            servicesTableRows = this.props.rolloutStatusStore.serviceDetails.map((service, index) => {
                if (service) {
                    return (
                        <Table.Row key={service.Service[0].Id}>
                            <Table.Cell>{service.Service[0].Name}</Table.Cell>
                            <Table.Cell>
                                <Link to={'/service/' + service.Service[0].Id} target="_blank">{service.Service[0].Shortcut}</Link>
                            </Table.Cell>
                            <Table.Cell>
                                <DismeStatus dismeStatus={service.Service[0].Status} />
                            </Table.Cell>
                            <Table.Cell>
                                <Button
                                    onClick={() =>
                                        window.open(
                                            _.replace(DISME_SERVICE_URL, new RegExp(DISME_SERVICE_PLACEHOLDER, "g"),
                                                service.Service[0].DismeID))}
                                    style={{ padding: '0.3em' }}
                                    size='medium'
                                    icon='external' />
                            </Table.Cell>
                            <Table.Cell>
                                {service.Servers.filter(x => x.Environment.toLowerCase() === "production").length}
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                                <Button onClick={() => this.removeServiceFromSearch(service.Service[0])} style={{ padding: '0.3em' }} icon="close"></Button>
                            </Table.Cell>
                        </Table.Row>
                    )
                }
                else {
                    return (
                        <Table.Row error>
                            <Table.Cell colSpan={6}>Could not get {this.state.inputProductsValues.split(",")[index]}</Table.Cell>
                        </Table.Row>
                    )
                }
            })
        }

        console.log("pica", this.props.headerStore.searchServiceShortcutsResult)
        servicesTableRows.push(
            <Table.Row key={-1}>
                <Table.Cell colSpan={6}>
                    <Dropdown
                        className="search"
                        icon='search'
                        selection
                        onChange={this.handleServiceChange}
                        options={this.props.headerStore.searchServiceShortcutsResult.filter(x => !this.state.inputProductsValues.split(",").includes(x.text)).slice(0, 10)}
                        fluid
                        selectOnBlur={false}
                        selectOnNavigation={false}
                        placeholder='Type to search a service'
                        value=""
                        onSearchChange={this.handleServiceShortcutSearchChange}
                        search
                    />
                </Table.Cell>
            </Table.Row>
        )


        // TODO: render only these which are in table service details. in Reducer there can be also the previous ones
        // 

        var segments; // segment for every application 
        // console.log(this.props.rolloutStatusStore.dismeApplications)
        var serviceDetails;
        if (this.state.inputProductsValues) {
            serviceDetails = (
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Service details
                            </Header>
                        <Segment attached='bottom'>
                            {
                                this.state.loadingServiceDetails ? (
                                    <Message info icon>
                                        <Icon name='circle notched' loading />
                                        <Message.Content>
                                            <Message.Header>Fetching service details</Message.Header>
                                        </Message.Content>
                                    </Message>
                                ) : (
                                        <SimpleTable columnProperties={serviceTableColumnProperties} body={servicesTableRows} />
                                    )
                            }
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            )
        }
        else {
            serviceDetails = null
        }


        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Rollout Status
                        </Header>
                        <Segment attached='bottom' >
                            <Grid stackable>
                                <Grid.Row>
                                    <Grid.Column width={3} >
                                        <Dropdown
                                            icon='search'
                                            selection
                                            onChange={this.handleDropdownOnChange}
                                            options={this.state.dismeApplicationsFiltered.length === 0 ? this.props.rolloutStatusStore.dismeApplications : this.state.dismeApplicationsFiltered}
                                            fluid
                                            selectOnBlur={false}
                                            selectOnNavigation={false}
                                            placeholder='Type to search an application'
                                            onSearchChange={this.handleOnSearchChange}
                                            search
                                            value={this.state.inputProductsValues === "" ? "" : this.state.dropdownValue}
                                        />
                                        {/* <Dropdown
                                            icon='search'
                                            selection
                                            onChange={(e) => this.handleServiceChange(e)}
                                            options={this.props.headerStore.searchServiceShortcutsResult.slice(0, 10)}
                                            fluid
                                            selectOnBlur={false}
                                            selectOnNavigation={false}
                                            placeholder='Type to search a service'
                                            value=""
                                            onSearchChange={this.handleServiceShortcutSearchChange}
                                            search
                                        /> */}
                                    </Grid.Column>
                                    <Grid.Column width={13} >
                                        <Input onChange={this.handleInputOnChange} fluid value={this.state.inputProductsValues} />
                                    </Grid.Column>
                                </Grid.Row>
                                {/* <Grid.Row textAlign="right">
                                    <Grid.Column>
                                        <Button onClick={() => this.handleGetRolloutStatusOnClick()} primary>Get Rollout Status</Button>
                                    </Grid.Column>
                                </Grid.Row> */}
                            </Grid>
                        </Segment>
                        {segments}
                    </Grid.Column>
                </Grid.Row>
                {serviceDetails}
            </Grid>
        )
    }
}

function mapStateToProps(state) {
    return {
        rolloutStatusStore: state.RolloutStatusReducer,
        headerStore: state.HeaderReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getDismeApplicationsAction,
        searchServiceShortcutAction,
        getServiceDetailsByShortcutsAction,
        removeServiceDetailsAction,
        getRolloutStatusAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RolloutStatus);
