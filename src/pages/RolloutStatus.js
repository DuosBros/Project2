import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import keyboardKey from 'keyboard-key'

import {
    getDismeApplicationsAction, getRolloutStatusAction,
    deleteAllRoloutStatusesAction, removeRolloutStatusAction
} from '../actions/RolloutStatusActions';

import {
    getHealthAction, getVersionAction, getServiceDetailsByShortcutsAction, removeServiceDetailsAction,
    removeAllServiceDetailsAction
} from '../actions/ServiceActions';

import { getDismeApplications, getServiceByShortcut, getHealth, getVersion } from '../requests/ServiceAxios';
import { Grid, Header, Segment, Dropdown, Table, Button, Message, Icon, TextArea, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import DismeStatus from '../components/DismeStatus';
import { DISME_SERVICE_URL, DISME_SERVICE_PLACEHOLDER } from '../appConfig';
import SimpleTable from '../components/SimpleTable';
import { searchServiceShortcut } from '../requests/HeaderAxios';
import { searchServiceShortcutAction } from '../actions/HeaderActions';
import { debounce, sleep, groupBy, isValidIPv4 } from '../utils/HelperFunction';
import { getRolloutStatus } from '../requests/RolloutStatusAxios';
import RolloutStatusTable from '../components/RolloutStatusTable';
import ErrorMessage from '../components/ErrorMessage';

const DEFAULT_SEGMENT = [
    {
        segmentName: "serviceDetails",
        isShowing: true
    }
]

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
            rolloutLoadingStatuses: [],
            segments: DEFAULT_SEGMENT
        }

        this.getServiceDetails = this.getServiceDetails.bind(this);
        this.getServiceDetails = debounce(this.getServiceDetails, 150);
        this.handleSearchServiceShortcut = this.handleSearchServiceShortcut.bind(this);
        this.handleSearchServiceShortcut = debounce(this.handleSearchServiceShortcut, 150);
    }

    componentDidMount() {

        this.changeInputBasedOnUrl();

        this.fechtAndHandleDismeApplications();

        document.addEventListener('keydown', this.handleDocumentKeyDown)
    }


    handleDocumentKeyDown = (e) => {
        const shortcutMatch = keyboardKey.getKey(e) === 'Enter';
        const hasModifier = e.altKey || e.ctrlKey || e.metaKey;

        if (!shortcutMatch || hasModifier) {
            return;
        }

        if(e.currentTarget.activeElement.tagName === "TEXTAREA") {
            this.getRolloutStatuses()
        }

        e.preventDefault();
    }

    componentWillUnmount() {
        this.props.removeAllServiceDetailsAction();
    }

    changeInputBasedOnUrl = () => {
        var params = new URLSearchParams(this.props.location.search).get('services');
        if (params) {
            this.handleInputOnChange({}, { value: params })
        }
        else {
            this.props.history.push("/rolloutstatus")
        }
    }

    fechtAndHandleDismeApplications = (resetServices) => {
        getDismeApplications()
            .then(res => {
                this.props.getDismeApplicationsAction({
                    success: true,
                    data: res.data.map(x =>
                        ({
                            text: x.Application,
                            value: x.Application,
                            services: x.Service

                        }))
                })
            })
            .catch(err => {
                this.props.getDismeApplicationsAction({ success: false, error: err })
            })
            .then(() => {
                if (resetServices) {
                    this.props.getServiceDetailsByShortcutsAction({ success: true, data: [] })
                }
                this.props.deleteAllRoloutStatusesAction()
            })
    }

    handleApplicationDropdownOnChange = (e, { value }) => {
        this.props.deleteAllRoloutStatusesAction()
        this.setState({ loadingServiceDetails: true, applicationDropdownValue: value });
        var filteredApps = this.props.rolloutStatusStore.dismeApplications.data.filter(x => x.value === value);

        var shortcuts = filteredApps.map(x => x.services.map(y => y.Shortcut))[0];

        var joinedShortcuts = shortcuts.join(",")

        this.setState({
            inputProductsValues: joinedShortcuts
        });

        this.getServiceDetails(joinedShortcuts)
    }

    handleApplicationDropdownOnSearchChange = (e) => {
        if (e.target.value.length > 1) {

            var filtered = this.props.rolloutStatusStore.dismeApplications.data.filter(x => x.text.toString().search(new RegExp(x.text, "i")) >= 0)
            this.setState({ dismeApplicationsFiltered: filtered });
        }
    }

    // getRolloutStatus(services) {
    //     var ids = services.map(x => x.Id)
    // }

    handleInputOnChange = (e, { value }) => {

        this.setState({ inputProductsValues: value });

        if (value) {
            this.props.history.push("/rolloutstatus?services=" + value)
        }
        else {
            this.props.deleteAllRoloutStatusesAction()
            this.props.history.push("/rolloutstatus")
            this.setState({ segments: DEFAULT_SEGMENT });
        }

        var valueToSearch = value.replace(/[^a-zA-Z0-9,_.-]/g, "")
        var uniqueValueToSearch = Array.from(new Set(valueToSearch.split(',')))
        this.getServiceDetails(uniqueValueToSearch)
    }

    getServiceDetails(services) {
        getServiceByShortcut(services)
            .then(res => {
                if (res.data) {
                    this.props.getServiceDetailsByShortcutsAction({ success: true, data: res.data })
                }
                else {
                    this.props.getServiceDetailsByShortcutsAction({ success: true, data: [] })
                }

                this.setState({ loadingServiceDetails: false });
            })
            .catch(err => {
                this.props.getServiceDetailsByShortcutsAction({ success: false, error: err })
            })
    }

    getHealthsAndVersions = () => {

        var cloned = Object.assign([], this.props.rolloutStatusStore.rolloutStatuses);

        cloned.forEach(element => {
            sleep(1000).then(() => {
                if (element.rolloutStatus) {
                    var grouped = groupBy(element.rolloutStatus, "Server")
                    var keys = Object.keys(grouped);

                    keys.forEach(e => {
                        this.getHealthAndVersion(false, grouped[e][0].Ip, grouped[e][0].Serverid, element.serviceId, element.serviceName)
                    })
                }
            });
        });
    }

    getHealthAndVersion = (refreshTriggered, ip, serverId, serviceId, serviceName) => {
        if (refreshTriggered) {
            var health = {
                serviceName: serviceName,
                serviceId: serviceId,
                ip: ip,
                refreshTriggered: refreshTriggered
            }

            this.props.getHealthAction(health)

            var version = {
                serviceName: serviceName,
                serviceId: serviceId,
                serverId: serverId,
                refreshTriggered: refreshTriggered
            }

            this.props.getVersionAction(version)

            return;
        }

        if (isValidIPv4(ip)) {
            getHealth(serviceId, ip)
                .then(res => {
                    var o = {
                        serviceName: serviceName,
                        serviceId: serviceId,
                        ip: ip,
                        health: res.data
                    }

                    this.props.getHealthAction(o)
                })
                .catch((err) => {
                    var o = {
                        serviceName: serviceName,
                        serviceId: serviceId,
                        ip: ip,
                        health: "",
                        err: err
                    }

                    this.props.getHealthAction(o)
                })
        }
        else {
            var o = {
                serviceName: serviceName,
                serviceId: serviceId,
                ip: ip,
                health: ""
            }

            this.props.getHealthAction(o)
        }

        getVersion(serviceId, serverId)
            .then(res => {
                var o = {
                    serviceName: serviceName,
                    serviceId: serviceId,
                    serverId: serverId,
                    version: res.data
                }

                this.props.getVersionAction(o)
            })
            .catch((err) => {
                var o = {
                    serviceName: serviceName,
                    serviceId: serviceId,
                    serverId: serverId,
                    version: "",
                    err: err
                }

                this.props.getVersionAction(o)
            })
    }

    handleSearchServiceShortcut(value) {
        searchServiceShortcut(value)
            .then(res => {
                this.props.searchServiceShortcutAction(res.data.map(e => ({ text: e.Name, value: e.Id })))
            })
        // no catch because it can throw errors while user is typing
    }

    handleServiceShortcutSearchChange = (e) => {
        if (e.target.value.length > 1) {
            this.handleSearchServiceShortcut(e.target.value)
        }
    }

    handleServiceChange = (e, m) => {
        var value = m.options.find(x => x.value === m.value).text;

        var servicesString = this.state.inputProductsValues ? this.state.inputProductsValues + "," + value : value
        this.setState({ inputProductsValues: servicesString });
        this.getServiceDetails(this.state.inputProductsValues)
    }

    handleToggleShowAllSegments = () => {

        var mapped;
        if (this.state.showAllSegments && this.state.segments.findIndex(x => x.isShowing === true) > -1) {
            mapped = this.state.segments.map(x => {
                x.isShowing = false
                return x
            })
            this.setState({ mapped });
        }
        else {
            mapped = this.state.segments.map(x => {
                x.isShowing = true
                return x
            })
            this.setState({ mapped });
        }
    }

    handleToggleShowingContent = (segment, isShowing) => {
        this.setState({
            segments: [...this.state.segments], ...this.state.segments.map(x => {
                if (x.segmentName === segment) {
                    x.isShowing = isShowing ? isShowing : !x.isShowing
                }

                return x
            })
        });
    }

    getRolloutStatuses = () => {
        this.props.deleteAllRoloutStatusesAction()

        var segments = Object.assign([], this.state.segments)

        this.props.serviceStore.serviceDetails.data.forEach(x => {
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

        this.props.serviceStore.serviceDetails.data.forEach(x => {
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
                    .then(() => {
                        this.getHealthsAndVersions()
                    })

            })
        });
    }

    removeServiceFromSearch = (service) => {
        var split = this.state.inputProductsValues.split(",")

        var filtered = split.filter(x => x !== service.Shortcut)

        var joined = filtered.join(",")

        if (filtered.length > 0) {
            this.props.history.push("/rolloutstatus?services=" + joined)
        }
        else {
            this.props.history.push("/rolloutstatus")
        }

        this.setState({ inputProductsValues: joined });

        this.props.removeServiceDetailsAction(service);
        this.props.removeRolloutStatusAction(service);
    }

    handleRefreshRolloutStatus = (shortcut, serviceId) => {
        this.handleToggleShowingContent(shortcut, true)

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

        var servicesTableRows = [];

        if (!this.props.serviceStore.serviceDetails.success) {
            servicesTableRows.push(
                <Table.Row error>
                    <Table.Cell colSpan={6}>Error fetching data</Table.Cell>
                </Table.Row>
            )
        }
        else {
            servicesTableRows = this.props.serviceStore.serviceDetails.data.map((service, index) => {
                if (service) {
                    return (
                        <Table.Row key={service.Service[0].Id}>
                            <Table.Cell>{service.Service[0].Name}</Table.Cell>
                            <Table.Cell>
                                <Link to={'/service/' + service.Service[0].Id}>{service.Service[0].Shortcut}</Link>
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

        // servicesTableRows.push(
        //     <Table.Row key={-1}>
        //         <Table.Cell colSpan={6}>
        //             <Dropdown
        //                 className="search"
        //                 icon='search'
        //                 selection
        //                 onChange={this.handleServiceChange}
        //                 options={this.props.headerStore.searchServiceShortcutsResult.filter(x => !this.state.inputProductsValues.split(",").includes(x.text)).slice(0, 10)}
        //                 fluid
        //                 selectOnBlur={false}
        //                 selectOnNavigation={false}
        //                 placeholder='Type to search a service'
        //                 value=""
        //                 onSearchChange={this.handleServiceShortcutSearchChange}
        //                 search
        //             />
        //         </Table.Cell>
        //     </Table.Row>
        // )

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
                            <RolloutStatusTable getHealthAndVersion={this.getHealthAndVersion} showTableHeaderFunctions={false} showTableHeader={false} data={x.rolloutStatus} defaultLimitOverride={0} />
                        )
                    }

                }
                else {
                    segmentContent = (
                        <RolloutStatusTable getHealthAndVersion={this.getHealthAndVersion} showTableHeaderFunctions={false} showTableHeader={false} data={x.rolloutStatus} defaultLimitOverride={0} />
                    )
                }
            }

            return (
                <Grid.Row key={i}>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            {x.serviceName}
                            <Button
                                size="tiny"
                                style={{ padding: '0em', marginRight: '0.5em', marginLeft: '0.5em' }}
                                onClick={() => this.handleRefreshRolloutStatus(x.serviceName, x.serviceId)}
                                icon='refresh' />
                            <Button
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

        var dismeApplicationsDropdown;
        if (this.props.rolloutStatusStore.dismeApplications.success) {
            dismeApplicationsDropdown = (
                <Dropdown
                    icon='search'
                    selection
                    onChange={this.handleApplicationDropdownOnChange}
                    options={this.state.dismeApplicationsFiltered.length === 0 ? this.props.rolloutStatusStore.dismeApplications.data : this.state.dismeApplicationsFiltered}
                    fluid
                    selectOnBlur={false}
                    selectOnNavigation={false}
                    placeholder='Type to search an application'
                    onSearchChange={this.handleApplicationDropdownOnSearchChange}
                    search
                    value={this.state.inputProductsValues === "" ? "" : this.state.applicationDropdownValue}
                />
            )
        }
        else {
            dismeApplicationsDropdown = (
                <ErrorMessage title="Failed to get disme applications" message="" handleRefresh={this.fechtAndHandleDismeApplications} error={this.props.rolloutStatusStore.dismeApplications.error} />
            )
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
                                        <strong>Disme Application</strong>
                                        {dismeApplicationsDropdown}
                                    </Grid.Column>
                                    <Grid.Column width={2} >
                                        <strong>Search for a service</strong>
                                        <Dropdown
                                            className="search"
                                            icon='search'
                                            selection
                                            onChange={this.handleServiceChange}
                                            options={this.props.headerStore.searchServiceShortcutsResult.filter(x => !this.state.inputProductsValues.split(",").includes(x.text)).slice(0, 10)}
                                            fluid
                                            selectOnBlur={false}
                                            selectOnNavigation={false}
                                            placeholder='Type to search'
                                            value=""
                                            onSearchChange={this.handleServiceShortcutSearchChange}
                                            search
                                        />
                                    </Grid.Column>
                                    <Grid.Column width={9} >
                                        <strong>List of services</strong><br />
                                        <Form>
                                            <TextArea autoHeight
                                                onChange={this.handleInputOnChange}
                                                value={this.state.inputProductsValues}
                                                placeholder='Insert coma delimited service shortcuts or select from the dropdown on the left'
                                                rows={1} />
                                        </Form>
                                    </Grid.Column>
                                    <Grid.Column verticalAlign="bottom" width={2} >
                                        <Button
                                            disabled={serviceDetails ? false : true}
                                            onClick={() => this.getRolloutStatuses()}
                                            fluid
                                            primary
                                            content="Get Rollout Statuses" />
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
        headerStore: state.HeaderReducer,
        serviceStore: state.ServiceReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getDismeApplicationsAction,
        searchServiceShortcutAction,
        getServiceDetailsByShortcutsAction,
        removeServiceDetailsAction,
        removeRolloutStatusAction,
        getRolloutStatusAction,
        deleteAllRoloutStatusesAction,
        getHealthAction,
        getVersionAction,
        removeAllServiceDetailsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RolloutStatus);
