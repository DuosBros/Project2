import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { Grid, Header, Segment, Table, Button, Input, Dropdown, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { getDismeApplications, getServiceByShortcut } from '../requests/ServiceAxios';
import { getServiceDetailsByShortcutsAction } from '../actions/ServiceActions';
import { getStagesAction, getVersionsAction } from '../actions/VersionStatusActions';
import { getDismeApplicationsAction } from '../actions/RolloutStatusActions';
import { DISME_SERVICE_URL, DISME_SERVICE_PLACEHOLDER } from '../appConfig';
import DismeStatus from '../components/DismeStatus';
import ErrorMessage from '../components/ErrorMessage';
import SimpleTable from '../components/SimpleTable';
import { getStages, getVersions } from '../requests/VersionStatusAxios';
import VersionStatusTable from '../components/VersionStatusTable';

const DEFAULT_SEGMENT = [
    {
        segmentName: "serviceDetails",
        isShowing: true
    },
    {
        segmentName: "versionStatus",
        isShowing: true
    }
]

class VersionStatus extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showAllSegments: true,
            dismeApplicationsFiltered: [],
            inputProductsValues: "",
            selectedServices: [],
            loadingServiceDetails: false,
            applicationDropdownValue: "",
            segments: DEFAULT_SEGMENT,
            selectedEnvironments: [],
            alertNoEnvironmentsSelected: false
        };
    }
    componentDidMount() {
        this.fechtAndHandleDismeApplications(true);
        this.fetchAndHandleStages();

        this.changeInputBasedOnUrl();
    }

    changeInputBasedOnUrl = () => {
        var params = new URLSearchParams(this.props.location.search).get('services');
        if (params) {
            this.handleInputOnChange({}, { value: params })
        }
        else {
            this.props.history.push("/versionstatus")
        }
    }

    fechtAndHandleDismeApplications = (keepServices) => {
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
                if (!keepServices) {
                    this.props.getServiceDetailsByShortcutsAction({ success: true, data: [] })
                }
            })
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

    fetchAndHandleStages = () => {
        getStages()
            .then(res => {
                this.props.getStagesAction({
                    success: true, data: res.data.map(x => x.Environments).reduce((a, b) => [...a, ...b], [])
                        .map(x =>
                            ({
                                text: x.Name,
                                value: x.Name,
                            }))
                })
            })
            .catch(err => {
                this.props.getStagesAction({
                    success: false, error: err
                })
            })
    }

    handleApplicationDropdownOnChange = (e, { value }) => {
        // this.props.deleteAllRoloutStatusesAction()
        this.setState({ loadingServiceDetails: true, applicationDropdownValue: value });
        var filteredApps = this.props.rolloutStatusStore.dismeApplications.data.filter(x => x.value === value);

        var shortcuts = filteredApps.map(x => x.services.map(y => y.Shortcut))[0];

        var joinedShortcuts = shortcuts.join(",")

        this.setState({
            inputProductsValues: joinedShortcuts
        });

        this.getServiceDetailsAndVersions(joinedShortcuts)
    }

    handleEnvironmentDropdownOnChange = (e, { value }) => {
        this.setState({ selectedEnvironments: value, alertNoEnvironmentsSelected: false });
        console.log(this)
        console.log(this.props.serviceStore.serviceDetails);

        if (this.props.serviceStore.serviceDetails.success) {
            var shortcuts = this.props.serviceStore.serviceDetails.data.map(x => x.Service[0].Shortcut)
            this.getServiceDetailsAndVersions(shortcuts);
        }
    }

    handleApplicationDropdownOnSearchChange = (e) => {
        if (e.target.value.length > 1) {

            var filtered = this.props.rolloutStatusStore.dismeApplications.data.filter(x => x.text.toString().search(new RegExp(x.text, "i")) >= 0)
            this.setState({ dismeApplicationsFiltered: filtered });
        }
    }

    handleInputOnChange = (e, { value }) => {

        this.setState({ inputProductsValues: value });

        if (value) {
            this.props.history.push("/versionstatus?services=" + value)
        }
        else {
            this.props.history.push("/rolloutstatus")
            this.setState({ segments: DEFAULT_SEGMENT });
        }

        var valueToSearch = value.replace(/[^a-zA-Z0-9,_.-]/g, "")
        var uniqueValueToSearch = Array.from(new Set(valueToSearch.split(',')))
        this.getServiceDetailsAndVersions(uniqueValueToSearch)
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

    getServiceDetailsAndVersions(services) {
        getServiceByShortcut(services)
            .then(res => {
                if (res.data) {
                    this.props.getServiceDetailsByShortcutsAction({ success: true, data: res.data })
                }
                else {
                    this.props.getServiceDetailsByShortcutsAction({ success: true, data: [] })
                }

                this.setState({ loadingServiceDetails: false });

                return true;
            })
            .catch(err => {
                this.props.getServiceDetailsByShortcutsAction({ success: false, error: err })
            })
            .then((res) => {
                if (res) {
                    this.getVersions(services)
                }
            })
    }

    getVersions = (services) => {
        if (this.state.selectedEnvironments.length === 0) {
            this.setState({ alertNoEnvironmentsSelected: true });
        }
        else {
            this.setState({ alertNoEnvironmentsSelected: false });

            var payload = {};
            payload.SelectedEnvironmentsString = this.state.selectedEnvironments;
            payload.SelectedServicesString = services

            getVersions(payload)
                .then(res => {
                    this.props.getVersionsAction({ success: true, data: res.data.data })
                })
                .catch(err => {
                    this.props.getVersionsAction({ success: false, error: err })
                })
        }
    }

    render() {
        var { showAllSegments, selectedEnvironments } = this.state;

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
                                        ) : (null)
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

        var environmentsDropdown;
        if (this.props.versionStatusStore.stages.success) {
            environmentsDropdown = (
                <Dropdown
                    error={this.state.alertNoEnvironmentsSelected}
                    multiple
                    selection
                    onChange={this.handleEnvironmentDropdownOnChange}
                    options={this.props.versionStatusStore.stages.data}
                    fluid
                    // selectOnBlur={false}
                    // selectOnNavigation={false}
                    placeholder='Select one or more environments'
                    // onSearchChange={this.handleApplicationDropdownOnSearchChange}
                    search
                // value={this.state.inputProductsValues === "" ? "" : this.state.applicationDropdownValue}
                />
            )
        }
        else {
            environmentsDropdown = (
                <ErrorMessage title="Failed to get stages" message="" handleRefresh={this.fetchAndHandleStages} error={this.props.versionStatusStore.stages.error} />
            )
        }

        var versionStatusSegment;
        if (!this.props.versionStatusStore.versions.success) {
            versionStatusSegment = (
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Version Info
                            <Button
                                basic
                                style={{ padding: '0em', marginRight: '0.5em' }}
                                onClick={() => this.handleToggleShowingContent("versionInfo")}
                                floated='right'
                                icon='content' />
                        </Header>
                        <Segment attached='bottom' >
                            <ErrorMessage error={this.props.versionStatusStore.versions.error} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            );
        }
        else {
            versionStatusSegment = (
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Version Info
                            <Button
                                basic
                                style={{ padding: '0em', marginRight: '0.5em' }}
                                onClick={() => this.handleToggleShowingContent("versionInfo")}
                                floated='right'
                                icon='content' />
                        </Header>
                        <Segment attached='bottom' >
                            <VersionStatusTable compact="very" data={this.props.versionStatusStore.versions.data} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            )

        }



        if (this.props.serviceStore.serviceDetails.data) {
            if (this.props.serviceStore.serviceDetails.data.length === 0 || selectedEnvironments.length === 0) {
                versionStatusSegment = null
            }
        }


        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Version Status
                            {
                                serviceDetails ? (
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
                                        {dismeApplicationsDropdown}
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
                                <Grid.Row >
                                    <Grid.Column width={10} >
                                        {environmentsDropdown}
                                    </Grid.Column>
                                    {/* <Grid.Column width={4} textAlign="right" >
                                        <Button primary content="Get rollout status" />
                                    </Grid.Column> */}
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                {serviceDetails}
                { this.state.segments.filter(x => x.segmentName === "versionStatus")[0].isShowing ? (versionStatusSegment) : (null)}
            </Grid>
        )
    }
}

function mapStateToProps(state) {
    return {
        headerStore: state.HeaderReducer,
        serviceStore: state.ServiceReducer,
        rolloutStatusStore: state.RolloutStatusReducer,
        versionStatusStore: state.VersionStatusReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getServiceDetailsByShortcutsAction,
        getDismeApplicationsAction,
        getStagesAction,
        getVersionsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(VersionStatus);