import React from 'react';
import { APP_TITLE, LOCO_API } from '../appConfig';
import { Grid, Header, Segment, Label, Icon, Button, Popup, Image, Divider, Dropdown } from 'semantic-ui-react';
import ServiceSearchDropdown from '../components/ServiceSearchDropdown';
import { trimmedSearch, asyncForEach, contains, groupBy, mapArrayForDropdown } from '../utils/HelperFunction';
import { getServiceDetails, getServiceByShortcut } from '../requests/ServiceAxios';
import GenericTable from '../components/GenericTable';
import ServerStatus from '../components/ServerStatus';
import DismeStatus from '../components/DismeStatus';
import { Link } from 'react-router-dom';
import Kibana from '../utils/Kibana';
import { getVersionsByServiceId } from '../requests/VersionStatusAxios';
import { getHealthCheckContent } from '../requests/HealthAxios';
import HealthLabel from '../components/HealthLabel';

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
            name: "IP",
            prop: "IPs",
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
        },
        {
            name: "Health",
            prop: "health",
            sortable: false,
            exportByDefault: false,
            skipRendering: true
        },
        {
            name: "Version",
            prop: "version",
            sortable: false,
            skipRendering: true
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

        if (data.health === "fetching") {
            data.health = <Icon loading name="spinner" />
        }
        else if (data.health) {
            data.health = <HealthLabel health={data.health} />
        }

        if (data.version === "fetching") {
            data.version = <Icon loading name="spinner" />
        }
        else if (data.version) {
            data.version = data.version.Version
        }

        return data;
    }

    render() {
        if (Array.isArray(this.props.data) && this.props.data[0].hasOwnProperty("health")) {
            this.columns.map(x => {
                if (x.prop === "health") {
                    delete x.skipRendering
                }
                return x
            })
        }
        else {
            this.columns.map(x => {
                if (x.prop === "health") {
                    x.skipRendering = true
                }
                return x
            })
        }

        if (Array.isArray(this.props.data) && this.props.data[0].hasOwnProperty("version")) {
            this.columns.map(x => {
                if (x.prop === "version") {
                    delete x.skipRendering
                }
                return x
            })
        }
        else {
            this.columns.map(x => {
                if (x.prop === "version") {
                    x.skipRendering = true
                }
                return x
            })
        }

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
        servicesFull: [],
        selectedEnvironments: []
    }

    componentDidMount() {
        document.title = APP_TITLE + "Health";
        this.changeInputBasedOnUrl();
        this.props.getServiceServersAction({ success: true })
    }


    changeInputBasedOnUrl = () => {
        var params = new URLSearchParams(this.props.location.search).get('services');
        if (params) {
            let split = params.split(",")
            split.forEach(async x => {
                let service = await getServiceByShortcut(x.trim())
                if (service.data) {
                    let selectedService = { key: service.data[0].Id, text: x, value: service.data[0].Id }
                    this.setState({ selectedServices: [...this.state.selectedServices, selectedService] })
                }
            })
        }
        else {
            this.props.history.push("/health")
        }
    }

    handleEnvironmentDropdownOnChange = (e, { value }) => {
        this.setState({ selectedEnvironments: value });
    }

    handleServiceChange = (e, { options, value }) => {
        let serviceToAdd = options.find(x => x.value === value)
        this.setState({ selectedServices: [...this.state.selectedServices, serviceToAdd] })
        this.props.history.push("/health?services=" + this.state.selectedServices.map(x => x.text).join(","))
    }

    handleRemoveService = (server) => {
        var array = this.state.selectedServices.slice();
        let index = array.findIndex(x => x.value === server)
        array.splice(index, 1);
        this.setState({ selectedServices: array });
        if (array.length === 0) {
            this.props.history.push("/health")
        }
        else {
            this.props.history.push("/health?services=" + array.map(x => x.text))
        }
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


    reflect = (promisePayload) => {
        return promisePayload.promise
            .then(v => {
                return {
                    res: v.data,
                    status: "resolved",
                    server: promisePayload.server,
                    url: promisePayload.url
                }
            })
            .catch(e => {
                return { e: e, status: "rejected", server: promisePayload.server }
            })
    }

    handleFetchVersions = async (servers) => {
        let getVersionsPayload = {
            Id: servers.map(x => x.Id)
        }

        servers = servers.slice()
        await asyncForEach(this.state.selectedServices, async x => {
            try {
                let res = await getVersionsByServiceId(x.value, getVersionsPayload);
                if (res.data) {

                    servers.forEach(x => {
                        let found = res.data.find(y => y.ServerName === x.ServerName)
                        x.version = found;
                    })

                    this.props.getServiceServersAction({ success: true, data: servers })
                }

                this.props.getVersionsAction({ data: res.data, success: true })
            } catch (err) {
                servers.forEach(x => {
                    x.version = "Failed - try again";
                })

                this.props.getServiceServersAction({ success: true, data: servers })

                this.props.getVersionsAction({ error: err, success: false })
            }
        })
    }

    handleFetchHealth = (servers) => {

        let servicesFull = this.state.servicesFull.slice();

        let promisePayloads = [];
        // await asyncForEach(servicesFull, async x => {
        servicesFull.forEach(x => {
            // await asyncForEach(x.Servers, async y => {
            x.Servers = x.Servers.filter(y => {
                return servers.some(z => {
                    return z.Id === y.Id;
                });
            })
            x.Servers.forEach(async y => {
                let ip = y.IPs[0]

                if (!ip) {
                    return;
                }

                //#region nothing to see here
                let healthcheck = x.HealthChecks.find(z => z.ServerName === y.ServerName && !contains(z.Url, "redirect-health"))

                let url, hostToReplace, host;
                if (healthcheck) {
                    url = healthcheck.Url;
                }
                else {
                    let healthchecks = x.HealthChecks.filter(z => !contains(z.Url, "redirect-health"))
                    healthcheck = healthchecks[healthchecks.length - 1]
                    url = healthcheck.Url;

                    let website = x.Websites.find(z => z.ServerName === y.ServerName)
                    if (website.Bindings) {
                        hostToReplace = website.Bindings[website.Bindings.length - 1].Binding
                    }
                }

                let regex = /(\/\/)(.*?)(\/)/g
                let regexRes = regex.exec(url)

                if (regexRes[2]) {
                    host = regexRes[2]
                    if (hostToReplace) {
                        url = url.replace(host, hostToReplace)
                        host = hostToReplace
                    }
                }
                else {
                    host = x.Service[0].Name
                }


                if (contains(url, "prod.env.works")) {
                    let toReplaceWith;
                    if (contains(y.Stage, "dev")) {
                        toReplaceWith = ".dev."
                    }

                    if (contains(y.Stage, "test")) {
                        toReplaceWith = ".test."
                    }

                    if (contains(y.Stage, "llt")) {
                        toReplaceWith = ".load."
                    }

                    if (contains(y.Stage, "production")) {
                        toReplaceWith = ".prod."
                    }

                    url = url.replace(".prod.", toReplaceWith)
                }
                //#endregion

                promisePayloads.push({
                    promise: getHealthCheckContent(url, ip, host),
                    server: y,
                    url: LOCO_API + 'healthcheck/content?url=' + url + "&ip=" + ip + "&host=" + host
                })
            })
        })

        Promise.all(promisePayloads.map(this.reflect))
            .then((res) => {
                let servers = this.props.serviceServers.data.slice()

                servers.forEach(x => {
                    let found = res.find(y => y.server.Id === x.Id)
                    x.health = found;
                })

                this.props.getServiceServersAction({ success: true, data: servers })
            })
            .catch((err) => {
                console.log(err);
            })

        this.setState({ servicesFull });
    }

    fetchHealthsAndVersions = () => {
        let servers = this.props.serviceServers.data.slice()

        if (this.state.selectedEnvironments.length > 0) {
            servers = servers.filter(x => {
                return this.state.selectedEnvironments.some(env => {
                    return env === x.Environment;
                });
            });
        }

        servers.map(x => {
            x.health = "fetching";
            x.version = "fetching";

            return x;
        })

        this.props.getServiceServersAction({ success: true, data: servers })

        this.handleFetchVersions(servers)
        this.handleFetchHealth(servers)
    }

    render() {

        let serversTable, servicesLabels, envDropdownFilter;

        servicesLabels = this.state.selectedServices.map(x => {
            return (
                <Label key={x.value}>
                    {x.text}
                    <Icon onClick={() => this.handleRemoveService(x.value)} name='delete' />
                </Label>
            )
        })

        if (this.state.selectedServices.length > 0 && this.props.serviceServers.data) {
            let envs = groupBy(this.props.serviceServers.data, "Environment");
            envs = Object.keys(envs);

            envDropdownFilter = (
                <>
                    <label>Environments:</label>
                    <Dropdown
                        additionPosition="bottom"
                        // error={this.state.alertNoEnvironmentsSelected}
                        multiple
                        selection
                        onChange={this.handleEnvironmentDropdownOnChange}
                        options={mapArrayForDropdown(envs)}
                        fluid
                        placeholder='Select one or more environments'
                        search
                        value={this.state.selectedEnvironments === "" ? "" : this.state.selectedEnvironments}
                    />
                </>
            )

            let servers = this.props.serviceServers.data.slice();

            if (this.state.selectedEnvironments.length > 0) {
                servers = servers.filter(x => {
                    return this.state.selectedEnvironments.some(env => {
                        return env === x.Environment;
                    });
                });
            }

            serversTable = (
                <>
                    <Divider />
                    <Grid.Row>
                        <Grid.Column>
                            <ServersTable removeServerFromList={this.removeServerFromList} tableHeader={false} rowsPerPage={0} compact="very" data={servers} />
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
                                                    onClick={() => this.fetchHealthsAndVersions()}
                                                    primary
                                                    disabled={this.state.selectedServices.length <= 0}
                                                    content="Fetch health & version" />
                                            </Grid.Column>
                                        )
                                    }
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        {envDropdownFilter}
                                    </Grid.Column>
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