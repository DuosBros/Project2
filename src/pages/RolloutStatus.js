import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { getDismeApplicationsAction, getServiceDetailsByShortcutsAction, removeServiceDetailsAction } from '../actions/RolloutStatusActions';
import { getDismeApplications, getServiceByShortcut } from '../requests/ServiceAxios';
import { Grid, Header, Segment, Dropdown, Input, Table, Button, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import DismeStatus from '../components/DismeStatus';
import { DISME_SERVICE_URL, DISME_SERVICE_PLACEHOLDER } from '../appConfig';
import SimpleTable from '../components/SimpleTable';
import { searchServiceShortcut } from '../requests/HeaderAxios';
import { searchServiceShortcutAction } from '../actions/HeaderActions';
import { debounce } from '../utils/HelperFunction';

class RolloutStatus extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dismeApplicationsFiltered: [],
            inputProductsValues: "",
            selectedServices: [],
            loadingServiceDetails: false,
            dropdownValue: ""

        }

        // this.handleSearchServiceShortcut = this.handleSearchServiceShortcut.bind(this);
        // this.handleSearchServiceShortcut = debounce(this.handleSearchServiceShortcut, 150);
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

        this.setState({
            inputProductsValues: shortcuts.join(","),
            // selectedProducts: filteredApps[0].services
        });

        getServiceByShortcut(shortcuts.join(","))
            .then(res => {
                this.props.getServiceDetailsByShortcutsAction(res.data)
                this.setState({ loadingServiceDetails: false });
            })

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

        getServiceByShortcut(value)
            .then(res => {
                this.props.getServiceDetailsByShortcutsAction(res.data)
            })

        this.setState({ inputProductsValues: value });
    }

    // handleSearchServiceShortcut(value) {
    //     searchServiceShortcut(value)
    //         .then(res => {
    //             this.props.searchServiceShortcutAction(res.data.map(e => ({ text: e.Name, value: e.Id })))
    //         })
    // }

    // handleServiceShortcutSearchChange = (e) => {
    //     if (e.target.value.length > 1) {
    //         this.handleSearchServiceShortcut(e.target.value)
    //     }
    // }

    // handleServiceChange = (e, { value }) => {
    //     this.setState({ inputProductsValues: e.target.innerText + "," + this.state.inputProductsValues });
    // }

    getServiceInfo = (inputProductsValues) => {
        var splitted = inputProductsValues.split(",")

        var result = splitted.map(service => {
            service = service.trim();


        })

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

        // this.setState({
        //     inputProductsValues: this.state.inputProductsValues
        //         .replace(new RegExp("\\b" + service.Shortcut + "\\b", "i"), "")
        //         .replace(/,\s*$/, "")
        //         .replace(/^,/, "")
        //         .replace(/,,+/g, ",")
        // })

        this.props.removeServiceDetailsAction(service);
    }

    render() {
        console.log(this.props.rolloutStatusStore.serviceDetails)
        this.getServiceInfo(this.state.inputProductsValues)

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

        var servicesTableRows = this.props.rolloutStatusStore.serviceDetails.map((service, index) => {
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
                        <Table.Cell colSpan={5}>Could not get {this.state.inputProductsValues.split(",")[index]}</Table.Cell>
                    </Table.Row>
                )
            }
        })

        var segments; // segment for every application 
        console.log(this.props.rolloutStatusStore.dismeApplications)

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
                                <Grid.Row textAlign="right">
                                    <Grid.Column>
                                        <Button onClick={() => this.handleGetRolloutStatusOnClick()} primary>Get Rollout Status</Button>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                        {segments}
                    </Grid.Column>
                </Grid.Row>
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
        removeServiceDetailsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RolloutStatus);
