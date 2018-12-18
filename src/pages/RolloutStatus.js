import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import {
    getDismeApplicationsAction, getServiceDetailsByShortcutsAction, removeServiceDetailsAction, getRolloutStatusAction,
    deleteAllRoloutStatusesAction, deleteRolloutStatusAction
} from '../actions/RolloutStatusActions';
import { getHealthAction, getVersionAction } from '../actions/ServiceActions';

import { getDismeApplications, getServiceByShortcut, getHealth, getVersion } from '../requests/ServiceAxios';
import { Grid, Header, Segment, Dropdown, Input, Table, Button, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import DismeStatus from '../components/DismeStatus';
import { DISME_SERVICE_URL, DISME_SERVICE_PLACEHOLDER } from '../appConfig';
import SimpleTable from '../components/SimpleTable';
import { searchServiceShortcut } from '../requests/HeaderAxios';
import { searchServiceShortcutAction } from '../actions/HeaderActions';
import { debounce, sleep, groupBy } from '../utils/HelperFunction';
import { getRolloutStatus } from '../requests/RolloutStatusAxios';
import RolloutStatusTable from '../components/RolloutStatusTable';

class RolloutStatus extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showAllSegments: true,
            dismeApplicationsFiltered: [],
            inputProductsValues: "",
            selectedServices: [],
            loadingServiceDetails: false,
            applicationDropdownValue: "",
            getServiceDetailsError: {},
            rolloutLoadingStatuses: [],
            segments: [
                {
                    segmentName: "serviceDetails",
                    isShowing: true
                }
            ]
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

    handleApplicationDropdownOnChange = (e, { value }) => {
        this.props.deleteAllRoloutStatusesAction()
        this.setState({ loadingServiceDetails: true, applicationDropdownValue: value });
        var filteredApps = this.props.rolloutStatusStore.dismeApplications.filter(x => x.value === value);

        var shortcuts = filteredApps.map(x => x.services.map(y => y.Shortcut))[0];

        var joinedShortcuts = shortcuts.join(",")

        this.setState({
            inputProductsValues: joinedShortcuts
        });

        this.getServiceDetailsAndRolloutStatus(joinedShortcuts)
    }

    handleApplicationDropdownOnSearchChange = (e) => {
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

        var valueToSearch = value.replace(/[^a-zA-Z0-9\,_.-]/g, "")
        var uniqueValueToSearch = Array.from(new Set(valueToSearch.split(',')))
        this.getServiceDetailsAndRolloutStatus(uniqueValueToSearch)
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
            .then(() => {
                this.getRolloutStatuses()
            })
    }

    getHealthsAndVersions = () => {

        var cloned = Object.assign([], this.props.rolloutStatusStore.rolloutStatuses);

        cloned.forEach(element => {
            sleep(1000).then(() => {
                var grouped = groupBy(element.rolloutStatus, "Server")
                var keys = Object.keys(grouped);

                keys.forEach(e => {
                    getHealth(element.serviceId, grouped[e][0].Ip)
                        .then(res => {
                            var o = {
                                serviceName: element.serviceName,
                                serviceId: element.serviceId,
                                ip: grouped[e][0].Ip,
                                health: res.data
                            }

                            this.props.getHealthAction(o)
                        })
                        
                    getVersion(element.serviceId, grouped[e][0].Serverid)
                        .then(res => {
                            var o = {
                                serviceName: element.serviceName,
                                serviceId: element.serviceId,
                                serverId: grouped[e][0].Serverid,
                                version: res.data
                            }

                            this.props.getVersionAction(o)
                        })
                        .catch(err => {
                            var o = {
                                serviceName: element.serviceName,
                                serviceId: element.serviceId,
                                serverId: grouped[e][0].Serverid,
                                version: JSON.stringify(err)
                            }

                            this.props.getHealthAction(o)
                        })

                })
            });
        });
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

    handleToggleShowAllSegments = () => {

        if (this.state.showAllSegments && this.state.segments.findIndex(x => x.isShowing === true) > -1) {
            var mapped = this.state.segments.map(x => {
                x.isShowing = false
                return x
            })
            this.setState({ mapped });
        }
        else {
            var mapped = this.state.segments.map(x => {
                x.isShowing = true
                return x
            })
            this.setState({ mapped });
        }
    }

    handleToggleShowingContent = (segment) => {
        this.setState({
            segments: [...this.state.segments], ...this.state.segments.map(x => {
                if (x.segmentName === segment) {
                    x.isShowing = !x.isShowing
                }

                return x
            }
            )
        });
    }

    getRolloutStatuses = () => {
        this.props.deleteAllRoloutStatusesAction()

        var segments = Object.assign([], this.state.segments)

        this.props.rolloutStatusStore.serviceDetails.forEach(x => {
            if (x === null) {
                return
            }

            var obj = {
                segmentName: x.Service[0].Shortcut,
                isShowing: true
            }

            segments.push(obj)
        })


        this.setState({
            segments: segments
        });

        this.props.rolloutStatusStore.serviceDetails.forEach(x => {
            if (x === null) {
                return
            }

            var shortcut = x.Service[0].Shortcut
            var serviceId = x.Service[0].Id

            var object = {
                serviceName: shortcut,
                serviceId: serviceId,
                rolloutStatus: null,
                isLoading: true
            }

            this.props.getRolloutStatusAction(object)

            sleep(1000).then(() => {
                getRolloutStatus(shortcut)
                    .then(res => {

                        var object = {
                            serviceName: shortcut,
                            serviceId: serviceId,
                            rolloutStatus: res.data,
                            isLoading: false
                        }
                        this.props.getRolloutStatusAction(object)
                        this.getHealthsAndVersions()
                    })
                    .catch(err => {
                        var object = {
                            serviceName: shortcut,
                            serviceId: serviceId,
                            rolloutStatus: [],
                            err: err,
                            isLoading: false
                        }
                        this.props.getRolloutStatusAction(object)
                    })

            })
        });
    }

    removeServiceFromSearch = (service) => {
        var split = this.state.inputProductsValues.split(",")

        var filtered = split.filter(x => x !== service.Shortcut)

        this.setState({ inputProductsValues: filtered.join(",") });

        this.props.removeServiceDetailsAction(service);
    }

    handleRefreshRolloutStatus = (shortcut, serviceId) => {
        var object = {
            serviceName: shortcut,
            serviceId: serviceId,
            rolloutStatus: null,
            isLoading: true
        }

        this.props.getRolloutStatusAction(object)

        getRolloutStatus(shortcut)
            .then(res => {

                var object = {
                    serviceName: shortcut,
                    serviceId: serviceId,
                    rolloutStatus: res.data,
                    isLoading: false
                }
                this.getHealthsAndVersions()
                this.props.getRolloutStatusAction(object)
            })
            .catch(err => {
                var object = {
                    serviceName: shortcut,
                    serviceId: serviceId,
                    rolloutStatus: [],
                    err: err,
                    isLoading: false
                }
                this.props.getRolloutStatusAction(object)
            })
    }

    render() {
        var { showAllSegments } = this.state;
        console.log(this.props.rolloutStatusStore.serviceDetails)
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
                            <Table.Cell textAlign="left">
                                <Button onClick={() => this.removeServiceFromSearch(service.Service[0])} style={{ padding: '0.3em' }} icon="close"></Button>
                            </Table.Cell>
                        </Table.Row>
                    )
                }
                else {
                    return (
                        <Table.Row key={index} error>
                            <Table.Cell colSpan={6}>Could not get {this.state.inputProductsValues.split(",")[index]}</Table.Cell>
                        </Table.Row>
                    )
                }
            })
        }

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

        var segments = this.props.rolloutStatusStore.rolloutStatuses.map((x, i) => {
            var segmentContent;
            if (x.err) {
                segmentContent = (
                    <Message error>
                        <Message.Header>{x.err.message}</Message.Header>
                    </Message>
                )
            }
            else {
                if (x.rolloutStatus !== null) {

                    if (x.rolloutStatus.length === 0) {
                        segmentContent = (
                            <Message warning>
                                <Message.Header>No data</Message.Header>
                            </Message>
                        )
                    }
                    else {
                        segmentContent = (
                            <RolloutStatusTable showTableHeaderFunctions={false} data={x.rolloutStatus} defaultLimitOverride={0} />
                        )
                    }

                }
                else {
                    segmentContent = (
                        <RolloutStatusTable showTableHeaderFunctions={false} data={x.rolloutStatus} defaultLimitOverride={0} />
                    )
                }
            }

            return (
                <Grid.Row key={i}>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            {x.serviceName}
                            <Button
                                basic
                                size="tiny"
                                style={{ padding: '0em', marginRight: '0.5em', marginLeft: '0.5em' }}
                                onClick={() => this.handleRefreshRolloutStatus(x.serviceName, x.serviceId)}
                                icon='refresh' />
                            <Button
                                basic
                                style={{ padding: '0em', marginRight: '0.5em' }}
                                onClick={() => this.handleToggleShowingContent(x.serviceName)}
                                floated='right'
                                icon='content' />
                        </Header>
                        <Segment attached='bottom' >
                            {
                                this.state.segments.filter(y => y.segmentName === x.serviceName)[0] ? (
                                    this.state.segments.filter(y => y.segmentName === x.serviceName)[0].isShowing ? (
                                        segmentContent
                                    ) : (
                                            null
                                        )
                                ) : (null)
                            }
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            )
        })

        var serviceDetails;
        if (this.state.inputProductsValues) {
            serviceDetails = (
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Service details
                            <Button
                                basic
                                style={{ padding: '0em', marginRight: '0.5em' }}
                                onClick={() => this.handleToggleShowingContent("serviceDetails")}
                                floated='right'
                                icon='content' />
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
                                        this.state.segments.filter(x => x.segmentName === "serviceDetails")[0].isShowing ? (
                                            <SimpleTable columnProperties={serviceTableColumnProperties} body={servicesTableRows} compact="very" />
                                        ) : (
                                                null
                                            )
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
                            {
                                serviceDetails || segments.length > 0 ? (
                                    <Button
                                        floated='right'
                                        onClick={() => this.handleToggleShowAllSegments()}
                                        content={showAllSegments && this.state.segments.every(x => x.isShowing === true) ? 'Hide All Segments' : 'Show All Segments'}
                                        icon='content'
                                        labelPosition='right'
                                        style={{ fontSize: 'medium', padding: '0.3em', bottom: '0.1em' }} />
                                ) : (
                                        null
                                    )
                            }
                        </Header>
                        <Segment attached='bottom' >
                            <Grid stackable>
                                <Grid.Row>
                                    <Grid.Column width={3} >
                                        <Dropdown
                                            icon='search'
                                            selection
                                            onChange={this.handleApplicationDropdownOnChange}
                                            options={this.state.dismeApplicationsFiltered.length === 0 ? this.props.rolloutStatusStore.dismeApplications : this.state.dismeApplicationsFiltered}
                                            fluid
                                            selectOnBlur={false}
                                            selectOnNavigation={false}
                                            placeholder='Type to search an application'
                                            onSearchChange={this.handleApplicationDropdownOnSearchChange}
                                            search
                                            value={this.state.inputProductsValues === "" ? "" : this.state.applicationDropdownValue}
                                        />
                                    </Grid.Column>
                                    <Grid.Column width={13} >
                                        <Input
                                            onChange={this.handleInputOnChange}
                                            fluid
                                            value={this.state.inputProductsValues}
                                            placeholder='Insert coma delimited service shortcuts or select from the dropdown on the left'
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                {serviceDetails}
                {segments}
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
        getRolloutStatusAction,
        deleteAllRoloutStatusesAction,
        deleteRolloutStatusAction,
        getHealthAction,
        getVersionAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RolloutStatus);
