import React from 'react';
import { APP_TITLE } from '../appConfig';
import { Grid, Header, Segment, Label, Icon, Button, Popup, Image, Divider } from 'semantic-ui-react';
import ServiceSearchDropdown from '../components/ServiceSearchDropdown';
import { trimmedSearch, asyncForEach, debounce, contains } from '../utils/HelperFunction';
import { getServiceDetails } from '../requests/ServiceAxios';
import GenericTable from '../components/GenericTable';
import ServerStatus from '../components/ServerStatus';
import DismeStatus from '../components/DismeStatus';
import { Link } from 'react-router-dom';
import Kibana from '../utils/Kibana';
import { getVersionsByServiceId } from '../requests/VersionStatusAxios';
import { getHealths, getHealthCheckContent } from '../requests/HealthAxios';

class ServersTable extends React.PureComponent {
    columns = [
        {
            name: "Name",
            prop: "ServerName",
            display: "ServerLink",
            width: 3
        },
        {
            name: "Status | Disme",
            prop: "state",
            width: 2,
            sortable: false,
            searchable: false
        },
        {
            name: "Environment",
            prop: "Environment",
            width: 3,
            collapsing: true
        },
        {
            name: "Stage",
            prop: "Stage",
            width: 3,
            collapsing: true
        },
        {
            name: "Links",
            prop: "Links",
            width: 1,
            sortable: false,
            searchable: false,
            exportByDefault: false
        },
        {
            name: "Remove from List",
            prop: "Actions",
            width: 1,
            sortable: false,
            searchable: false,
            exportByDefault: false
        }
    ];

    transformDataRow(data) {

        data.Actions = (
            <Button onClick={() => this.removeServerFromList(data.Id)} style={{ padding: '0.3em' }} icon="close"></Button>
        )
        data.Links = (
            <>
                <Popup trigger={
                    <Button
                        as="a"
                        href={Kibana.dashboardLinkBuilder("prod", "winlogbeat2").addFilter("beat.hostname", data.ServerName).build()}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: '0.3em' }}
                        size='medium'
                        icon={
                            <Image src={window.location.protocol + '//' + window.location.host + "/icons/kibana.png"} />
                        } />
                } content='Go to Kibana winlogbeat' inverted />

                <Popup trigger={
                    <Button
                        as="a"
                        href={Kibana.dashboardLinkBuilder("prod", "metricsWindows").addFilter("beat.hostname", data.ServerName).build()}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: '0.3em' }}
                        size='medium'
                        icon={
                            <Image src={window.location.protocol + '//' + window.location.host + "/icons/kibana.png"} />
                        } />
                } content='Go to Kibana perfcounter' inverted />
            </>
        );

        data.ServerLink = (<Link to={'/server/' + data.Id}>{data.ServerName}</Link>);
        data.state = (
            <>
                <ServerStatus size='small' serverState={data.ServerState} />
                <DismeStatus size='small' dismeStatus={data.Disme} />
            </>
        );

        if (Array.isArray(data.IPs)) {
            data.IPs = data.IPs.join(",")
        }

        return data;
    }

    render() {
        return (
            <GenericTable
                columns={this.columns}
                transformDataRow={this.transformDataRow}
                {...this.props}
            />
        );
    }
}

class Health extends React.PureComponent {

    state = {
        selectedServices: [],
        servicesFull: []
    }

    componentDidMount() {
        document.title = APP_TITLE + "Health";

        this.props.getServiceServersAction({ success: true })
    }

    handleServiceChange = (e, { options, value }) => {
        let serviceToAdd = options.find(x => x.value === value)
        this.setState({ selectedServices: [...this.state.selectedServices, serviceToAdd] })
    }

    handleRemoveService = (server) => {
        var array = this.state.selectedServices.slice();
        let index = array.findIndex(x => x.value === server)
        array.splice(index, 1);
        this.setState({ selectedServices: array });
    }

    handleOnchange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    handleFetchServers = async () => {
        let servers = []
        let servicesFull = []
        await asyncForEach(this.state.selectedServices, async x => {
            try {
                let res = await getServiceDetails(x.value)
                if (res.data && res.data.Servers) {
                    servers.push(res.data.Servers)
                    servicesFull.push(res.data)
                }
            } catch (err) {
                this.props.getServiceServersAction({ success: false, error: err })
            }
        })

        this.props.getServiceServersAction({ success: true, data: servers.flat(1) })
        this.setState({ servicesFull: servicesFull });
    }

    removeServerFromList = (id) => {
        this.props.deleteServiceServerAction(id)
    }


    reflect = (promise) => {
        return promise.then(function (v) { return { v: v, status: "resolved" } },
            function (e) { return { e: e, status: "rejected" } });
    }


    handleFetchHealthAndVersion = async () => {
        debugger

        let servers = this.props.serviceServers.data.slice();

        let getVersionsPayload = {
            Id: this.props.serviceServers.data.map(x => x.Id)
        }

        // let getHealthsPayload = {
        //     Ip: this.props.serviceServers.data.map(x => x.IPs[0] && x.IPs[0].IpAddress)
        // }

        this.state.servicesFull.forEach(x => {
            let healthcheck = x.HealthChecks.find(z => !contains(z.Url, "redirect-health"))
            x.Servers.forEach(async y => {
                let ip = y.IPs[0] && y.IPs[0].IpAddress

                if (!ip) {
                    return;
                }

                try {
                    let res = await getHealthCheckContent(healthcheck.Url, ip, x.Service[0].Name)
                    if (res.data) {
                        y.healthContent = res.data
                        y.doesContainCHECK_OK = contains(res.data, "CHECK_OK")
                    }
                }
                catch (error) {
                    y.healthContent = error;
                    y.doesContainCHECK_OK = false;
                }

                return y;
            })
        })

        await asyncForEach(this.state.selectedServices, async x => {
            try {
                let res = await getVersionsByServiceId(x.value, getVersionsPayload);
                this.props.getVersionsAction({ data: res.data, success: true })
            } catch (err) {
                this.props.getVersionsAction({ error: err, success: false })
            }

            // try {
            //     let res = await getHealths(x.value, getHealthsPayload);
            //     this.props.getHealthsAction({ data: res.data, success: true })
            // } catch (err) {
            //     this.props.getHealthsAction({ error: err, success: false })
            // }
        })
    }

    render() {

        let serversTable, servicesLabels;

        servicesLabels = this.state.selectedServices.map(x => {
            return (
                <Label key={x.value}>
                    {x.text}
                    <Icon onClick={() => this.handleRemoveService(x.value)} name='delete' />
                </Label>
            )
        })

        if (this.state.selectedServices.length > 0 && this.props.serviceServers.data) {
            serversTable = (
                <>
                    <Divider />
                    <Grid.Row>
                        <Grid.Column>
                            <ServersTable removeServerFromList={this.removeServerFromList} tableHeader={false} rowsPerPage={0} compact="very" data={this.props.serviceServers.data} />
                        </Grid.Column>
                    </Grid.Row>
                    <Divider />
                </>
            )
        }

        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Health
                        </Header>
                        <Segment attached='bottom' >
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={3}>
                                        <strong>Search services:</strong>
                                        <ServiceSearchDropdown
                                            placeholder='Type to search a service'
                                            handleServiceChange={this.handleServiceChange}
                                            options={this.props.options}
                                            handleServiceShortcutSearchChange={this.props.handleServiceShortcutSearchChange}
                                            search={trimmedSearch} />
                                    </Grid.Column>
                                    <Grid.Column width={8}>
                                        <strong>Selected services:</strong> <br />
                                        {servicesLabels}
                                    </Grid.Column>
                                    <Grid.Column width={2} textAlign="right" verticalAlign="bottom">
                                        <Button
                                            onClick={this.handleFetchServers}
                                            primary
                                            disabled={this.state.selectedServices.length <= 0}
                                            content="Fetch servers" />
                                    </Grid.Column>
                                    {
                                        serversTable && (
                                            <Grid.Column width={3} textAlign="right" verticalAlign="bottom">
                                                <Button
                                                    onClick={this.handleFetchHealthAndVersion}
                                                    primary
                                                    disabled={this.state.selectedServices.length <= 0}
                                                    content="Fetch health & version" />
                                            </Grid.Column>
                                        )
                                    }
                                </Grid.Row>
                                {serversTable}
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default Health;