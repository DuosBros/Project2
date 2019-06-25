import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import keyboardKey from 'keyboard-key'

import {
    getDismeApplicationsAction, getRolloutStatusAction,
    deleteAllRoloutStatusesAction, removeRolloutStatusAction,
    getServiceDetailsByShortcutsAction, removeServiceDetailsAction,
    removeAllServiceDetailsAction, getHealthsRolloutStatusAction, getVersionsRolloutStatusAction,
    searchServiceShortcutAction
} from '../utils/actions';

import { getDismeApplications, getVersionsForRollout } from '../requests/ServiceAxios';
import { getHealths } from '../requests/HealthAxios';
import { Grid, Header, Segment, Dropdown, Table, Button, Message, Icon, TextArea, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import DismeStatus from '../components/DismeStatus';
import { DISME_SERVICE_URL, DISME_SERVICE_PLACEHOLDER, APP_TITLE } from '../appConfig';
import SimpleTable from '../components/SimpleTable';
import { searchServiceShortcut } from '../requests/HeaderAxios';
import { debounce, sleep, isValidIPv4, isNum } from '../utils/HelperFunction';
import { getRolloutStatus } from '../requests/RolloutStatusAxios';
import RolloutStatusTable from '../components/RolloutStatusTable';
import ErrorMessage from '../components/ErrorMessage';
import ServiceSearchDropdown from '../components/ServiceSearchDropdown';
import { getServiceDetailsByShortcutHandler } from '../handlers/ServiceHandler';

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

        this.handleSearchServiceShortcut = this.handleSearchServiceShortcut.bind(this);
        this.handleSearchServiceShortcut = debounce(this.handleSearchServiceShortcut, 150);
    }

    componentDidMount() {

        this.changeInputBasedOnUrl();

        this.fechtAndHandleDismeApplications();

        document.addEventListener('keydown', this.handleDocumentKeyDown)

        document.title = APP_TITLE + "Rollout Status"
    }

    handleDocumentKeyDown = (e) => {
        const shortcutMatch = keyboardKey.getKey(e) === 'Enter';
        const hasModifier = e.altKey || e.ctrlKey || e.metaKey;
        const bodyHasFocus = document.activeElement === document.body

        if (!shortcutMatch || hasModifier) {
            return;
        }

        if (e.currentTarget.activeElement.tagName === "TEXTAREA" || bodyHasFocus) {
            this.getRolloutStatuses()
        }

        e.preventDefault();
    }

    componentWillUnmount() {
        this.props.removeAllServiceDetailsAction();
        this.props.searchServiceShortcutAction([])
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

    handleApplicationDropdownOnChange = async (e, { value }) => {
        this.props.deleteAllRoloutStatusesAction()
        this.setState({ loadingServiceDetails: true, applicationDropdownValue: value });
        var filteredApps = this.props.rolloutStatusStore.dismeApplications.data.filter(x => x.value === value);

        var shortcuts = filteredApps[0].services.sort((a, b) => a.Shortcut > b.Shortcut ? 1 : -1).map(x => x.Shortcut);

        var joinedShortcuts = shortcuts.join(",")
        this.props.history.push("/rolloutstatus?services=" + joinedShortcuts)
        this.setState({
            inputProductsValues: joinedShortcuts
        });

        await getServiceDetailsByShortcutHandler(joinedShortcuts, this.props.getServiceDetailsByShortcutsAction);
        this.setState({ loadingServiceDetails: false });
    }

    handleApplicationDropdownOnSearchChange = (e) => {
        if (e.target.value.length > 1) {
            var filtered = this.props.rolloutStatusStore.dismeApplications.data.filter(x => x.text.toString().search(new RegExp(x.text, "i")) >= 0)
            this.setState({ dismeApplicationsFiltered: filtered });
        }
    }

    handleInputOnChange = async (e, { value }) => {

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

        await getServiceDetailsByShortcutHandler(uniqueValueToSearch, this.props.getServiceDetailsByShortcutsAction);
        this.setState({ loadingServiceDetails: false });
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

    handleServiceChange = async (e, m) => {
        var value = m.options.find(x => x.value === m.value).text;

        var servicesString = this.state.inputProductsValues ? this.state.inputProductsValues + "," + value : value
        this.props.history.push("/rolloutstatus?services=" + servicesString)
        this.setState({ inputProductsValues: servicesString });

        await getServiceDetailsByShortcutHandler(servicesString, this.props.getServiceDetailsByShortcutsAction);
        this.setState({ loadingServiceDetails: false });
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

    getRolloutStatuses = async () => {

        // wiping previous rollout statuses
        this.props.deleteAllRoloutStatusesAction()

        // mapping segments for UI (loading and header info)
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


        this.setState({ segments: segments });

        // for every service in store, get the rollout status
        this.props.serviceStore.serviceDetails.data.forEach(async x => {
            if (x === null) {
                return
            }

            var shortcut = x.Service[0].Shortcut
            var serviceId = x.Service[0].Id

            var object = {
                serviceName: shortcut,
                serviceId: serviceId,
                isLoading: true
            }

            this.props.getRolloutStatusAction(object)

            await sleep(1500)
            this.getRolloutStatusAndHandleResult(shortcut, serviceId);
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
        // if the segment is not showing -> show the segment if refresh is toggled
        this.handleToggleShowingContent(shortcut, true)

        // preparing the objects which will be sent to reducer to indicate a fresh state

        var object = {
            serviceName: shortcut,
            serviceId: serviceId,
            isLoading: true
        }

        var health = {
            success: true,
            serviceId: serviceId

        }

        var version = {
            success: true,
            serviceId: serviceId,
        }

        this.props.getHealthsRolloutStatusAction(health)
        this.props.getVersionsRolloutStatusAction(version)
        this.props.getRolloutStatusAction(object)
        this.getRolloutStatusAndHandleResult(shortcut, serviceId);
    }

    getRolloutStatusAndHandleResult = async (shortcut, serviceId) => {
        let res;
        let object = {
            serviceName: shortcut,
            serviceId: serviceId,
            isLoading: false
        };

        // get rollout status details
        try {
            res = await getRolloutStatus(shortcut)
            object.rolloutStatus = res.data;
            this.props.getRolloutStatusAction(object)
        }
        catch (err) {
            object.err = err
            this.props.getRolloutStatusAction(object)
        }

        // get health and version info
        if (res) {
            this.getHealthsAndVersions()
        }
    }

    getHealthsAndVersions = () => {

        let cloned = Object.assign([], this.props.rolloutStatusStore.rolloutStatuses);

        // it needs to be done sequentionally because of API
        cloned.filter(x => x.isLoading === false).forEach(async element => {

            const serviceId = element.serviceId;

            const ips = element.rolloutStatus.map(x => x.Ip).filter(x => isValidIPv4(x));
            const serverIds = element.rolloutStatus.map(x => x.Serverid).filter(x => isNum(x) && x !== 0);

            if (ips.length > 0) {
                let getHealthsPayload = { Ip: ips }
                try {
                    let res = await getHealths(serviceId, getHealthsPayload)

                    this.props.getHealthsRolloutStatusAction({ success: true, serviceId: serviceId, data: res.data })
                }
                catch (err) {
                    this.props.getHealthsRolloutStatusAction({ success: false, error: err, serviceId: serviceId })
                }
            }
            else {
                this.props.getHealthsRolloutStatusAction({ success: false, serviceId: serviceId, error: "No data" })
            }

            if (serverIds.length > 0) {
                let getVersionsPayload = { Id: serverIds }
                try {
                    let res = await getVersionsForRollout(serviceId, getVersionsPayload)

                    this.props.getVersionsRolloutStatusAction({ success: true, serviceId: serviceId, data: res.data })
                }
                catch (err) {
                    this.props.getVersionsRolloutStatusAction({ success: false, error: err, serviceId: serviceId })
                }
            }
            else {
                this.props.getVersionsRolloutStatusAction({ success: false, serviceId: serviceId, error: "No data" })
            }
        });
    }


    render() {
        var { showAllSegments } = this.state;

        const serviceDetailsData = Array.isArray(this.props.serviceStore.serviceDetails.data) ? this.props.serviceStore.serviceDetails.data : null
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
                <Table.Row key={-1} error>
                    <Table.Cell colSpan={6}>Error fetching data</Table.Cell>
                </Table.Row>
            )
        }
        else if (!serviceDetailsData) {
            servicesTableRows.push(
                <Table.Row key={-1} warning>
                    <Table.Cell colSpan={6}>Fetching service details</Table.Cell>
                </Table.Row>
            )
        }
        else {
            servicesTableRows = serviceDetailsData.map((service, index) => {
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
                if (x.rolloutStatus) {

                    if (x.rolloutStatus.length === 0) {
                        segmentContent = (
                            <Message warning>
                                <Message.Header>No data</Message.Header>
                            </Message>
                        )
                    }
                    else {
                        segmentContent = (
                            <RolloutStatusTable tableHeader={false} data={x.rolloutStatus} rowsPerPage={0} />
                        )
                    }

                }
                else {
                    segmentContent = (
                        <RolloutStatusTable tableHeader={false} data={x.rolloutStatus} rowsPerPage={0} />
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
                                        <ServiceSearchDropdown
                                            className="search"
                                            handleServiceChange={this.handleServiceChange}
                                            options={this.props.headerStore.searchServiceShortcutsResult.filter(x => !this.state.inputProductsValues.split(",").includes(x.text)).slice(0, 10)}
                                            handleServiceShortcutSearchChange={this.handleServiceShortcutSearchChange} />
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
                                            onClick={this.getRolloutStatuses}
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
        removeAllServiceDetailsAction,
        getHealthsRolloutStatusAction,
        getVersionsRolloutStatusAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RolloutStatus);
