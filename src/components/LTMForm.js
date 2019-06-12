import React from 'react';
import { Form, Grid, Dropdown, Button, Segment } from 'semantic-ui-react';
import { DEFAULT_TEAMS, LTMB2CTYPES } from '../appConfig';
import ServiceSearchDropdown from './ServiceSearchDropdown';
import { mapArrayForDropdown } from '../utils/HelperFunction';

class LTMForm extends React.PureComponent {
    state = {
        https: false,
        ext: false,
        redirect: false,
        redirectRedirectWeb: true,
        redirectIrule: false,
        url: "",
        monitorNamePostfix: "",
        monitorName: "",
        overrideMonitor: false,
        loadbalancers: [],
        persistence: ""
    }

    handleOnchange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    toggleCheckbox = (e, { name, checked }) => {
        this.setState({ [name]: checked })
        if (name === "ext" && checked === true) {
            this.setState({ https: true, redirect: true });
        }
        if (name === "redirectIrule") {
            this.setState({ redirectRedirectWeb: !checked });
        }
    }

    handleTypeDropdownOnchange = (e, { name }) => {
        this.props.getDefaultsAndHandleData(name)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.defaults.data !== prevState.defaults) {
            return {
                defaults: nextProps.defaults.data,
                port: nextProps.defaults.data.Port,
                httpProfile: nextProps.defaults.data.HttpProfile,
                monitorName: nextProps.defaults.data.MonitorName,
                monitorResponse: nextProps.defaults.data.MonitorResponse,
                monitorType: nextProps.defaults.data.MonitorType,
                monitorNamePostfix: nextProps.defaults.data.MonitorNamePostfix,
                monitorCodeEndpoint: nextProps.defaults.data.MonitorCodeEndpoint,
                monitorInterval: nextProps.defaults.data.MonitorInterval,
                monitorTimeout: nextProps.defaults.data.MonitorTimeout,
                persistence: nextProps.defaults.data.Persistence,
                oneconnect: nextProps.defaults.data.Oneconnect === "None" ? false : true
            };
        }
        else return null;
    }


    render() {
        let form, typeRow, generateLTMJsonColumn, backendOverrides, generateGTMJsonColumn;

        if (this.state.type === LTMB2CTYPES[0].value ||
            ((this.state.type === LTMB2CTYPES[1].value || this.props.team === DEFAULT_TEAMS[1].value) &&
                this.state.url.length > 0 &&
                this.state.port.length > 0 &&
                this.state.httpProfile.length > 0 &&
                this.state.monitorName.length > 0 &&
                this.state.monitorResponse.length > 0 &&
                this.state.monitorType.length > 0 &&
                this.state.monitorNamePostfix.length > 0 &&
                this.state.monitorCodeEndpoint.length > 0 &&
                this.state.monitorInterval.toString().length > 0 &&
                this.state.monitorTimeout.toString().length > 0 &&
                this.state.loadbalancers.length > 0)) {
            generateLTMJsonColumn = (
                <Grid.Column>
                    <Button primary onClick={() => this.props.fetchLTM({ Type: this.state.type, Service: this.props.selectedService, state: this.state })} content="Generate LTM JSON" />
                </Grid.Column>
            )
        }

        if (this.props.ltmJson) {
            generateGTMJsonColumn = (
                <Grid.Column>
                    <Button primary onClick={() => this.props.fetchGTM({ ltm: this.props.ltmJson }, true)} content="Generate GTM JSON" />
                </Grid.Column>
            )
        }

        if (this.state.type === LTMB2CTYPES[1].value || this.props.team === DEFAULT_TEAMS[1].value) {
            let monitorName = this.state.monitorName;
            if (this.state.url.length > 0) {
                monitorName = monitorName.replace("<url>", this.state.url)
            }

            if (this.state.monitorNamePostfix.length > 0) {
                monitorName = monitorName.replace("<MonitorNamePostfix>", this.state.monitorNamePostfix)
            }

            backendOverrides = (
                <Grid.Row>
                    <Grid.Column>
                        <Form>
                            <Segment.Group piled>
                                <Segment>
                                    <Form.Group widths="equal">
                                        <Form.Input placeholder="Without http:// or https://" label="Url:" fluid name="url" onChange={this.handleOnchange} />
                                        <Form.Input label="Port:" value={this.state.port} fluid name="port" onChange={this.handleOnchange} />
                                        <Form.Input label="Http Profile:" value={this.state.httpProfile} fluid name="httpProfile" onChange={this.handleOnchange} />
                                        <Form.Input placeholder="Certificate name" label="SSL Profile:" fluid name="sslProfile" onChange={this.handleOnchange} />
                                    </Form.Group>
                                </Segment>
                                <Segment>
                                    <Form.Checkbox name="overrideMonitor" label='Override monitor settings' onChange={this.toggleCheckbox} checked={this.state.overrideMonitor} />
                                    <Form.Group>
                                        <Form.Input disabled={!this.state.overrideMonitor} width={5} label="Name:" value={monitorName} fluid name="monitorName" onChange={this.handleOnchange} />
                                        <Form.Input disabled={!this.state.overrideMonitor} width={2} label="Response:" value={this.state.monitorResponse} fluid name="monitorResponse" onChange={this.handleOnchange} />
                                        <Form.Input disabled={!this.state.overrideMonitor} width={1} label="Type:" value={this.state.monitorType} fluid name="monitorType" onChange={this.handleOnchange} />
                                        <Form.Input disabled={!this.state.overrideMonitor} width={2} label="Name Postfix:" value={this.state.monitorNamePostfix} fluid name="monitorNamePostfix" onChange={this.handleOnchange} />
                                        <Form.Input disabled={!this.state.overrideMonitor} width={2} label="Code Endpoint:" value={this.state.monitorCodeEndpoint} fluid name="monitorCodeEndpoint" onChange={this.handleOnchange} />
                                        <Form.Input disabled={!this.state.overrideMonitor} width={1} label="Interval:" value={this.state.monitorInterval} fluid name="monitorInterval" onChange={this.handleOnchange} />
                                        <Form.Input disabled={!this.state.overrideMonitor} width={1} label="Timeout:" value={this.state.monitorTimeout} fluid name="monitorTimeout" onChange={this.handleOnchange} />
                                    </Form.Group>
                                </Segment>
                                <Segment>
                                    <Grid stackable>
                                        <Grid.Row>
                                            <Grid.Column width={6}>
                                                <strong>Load balancers</strong><br />
                                                <Dropdown
                                                    fluid
                                                    name="loadbalancers"
                                                    onChange={this.handleOnchange}
                                                    placeholder='Loadbalancers'
                                                    multiple
                                                    search
                                                    selection
                                                    options={mapArrayForDropdown(this.props.defaults.data.Lbs)}
                                                />
                                            </Grid.Column>
                                            <Grid.Column width={4}>
                                                <strong>Persistence</strong><br />
                                                <Dropdown
                                                    fluid
                                                    name="persistence"
                                                    onChange={this.handleOnchange}
                                                    placeholder='Persistences'
                                                    search
                                                    selection
                                                    value={this.state.persistence}
                                                    options={mapArrayForDropdown(this.props.defaults.data.DefaultPersistences)}
                                                />
                                            </Grid.Column>
                                            <Grid.Column width={6}>
                                                {this.props.team === DEFAULT_TEAMS[0].value && (
                                                    <>
                                                        <Form.Checkbox name="ext" label='Externally available' onChange={this.toggleCheckbox} checked={this.state.ext} />
                                                        <Form.Checkbox disabled={this.state.ext} name="redirect" label='Redirect' onChange={this.toggleCheckbox} checked={this.state.ext || this.state.redirect} />
                                                        {
                                                            this.state.redirect && (
                                                                <>
                                                                    <Form.Checkbox style={{ paddingLeft: '3em' }} name="redirectIrule" label={"Using irule: " + this.props.defaults.data.HttpToHttpsIrule} onChange={this.toggleCheckbox} checked={this.state.redirectIrule} />
                                                                    <Form.Checkbox style={{ paddingLeft: '3em' }} name="redirectRedirectWeb" label={"Using default pool: " + this.props.defaults.data.RedirectPool} onChange={this.toggleCheckbox} checked={this.state.redirectRedirectWeb} />
                                                                </>
                                                            )
                                                        }
                                                    </>
                                                )}
                                                <Form.Checkbox disabled={this.state.ext || this.state.redirect} name="https" label='HTTPS' onChange={this.toggleCheckbox} checked={this.state.ext || this.state.https || this.state.redirect} />
                                                <Form.Checkbox name="oneconnect" label='Oneconnect' onChange={this.toggleCheckbox} checked={this.state.oneconnect} />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>


                                </Segment>
                            </Segment.Group>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            )
        }

        if (this.props.selectedService) {
            typeRow = (
                <Grid.Row columns={4} verticalAlign="bottom">
                    <Grid.Column width={4}>
                        <strong>Type:</strong> <br />
                        <Dropdown name="type" onChange={this.handleOnchange} selection options={LTMB2CTYPES} />
                    </Grid.Column>
                </Grid.Row>
            )
        }

        if (this.props.team === DEFAULT_TEAMS[0].value) {
            form = (
                <>
                    {typeRow}
                    {backendOverrides}
                </>
            )
        }

        if (this.props.team === DEFAULT_TEAMS[1].value) {
            form = (
                <>
                    {backendOverrides}
                </>
            )
        }

        return (
            <Grid>
                <Grid.Row columns={4}>
                    <Grid.Column width={4}>
                        <strong>Search service:</strong>
                        <ServiceSearchDropdown
                            className="search"
                            handleServiceChange={this.props.handleServiceChange}
                            options={this.props.searchServiceShortcutsResult}
                            handleServiceShortcutSearchChange={this.props.handleServiceShortcutSearchChange} />
                        <strong>Service:</strong>
                        <Form.Input value={this.props.selectedService} fluid disabled></Form.Input>
                    </Grid.Column>
                    <Grid.Column width={4}>
                    </Grid.Column>
                    <Grid.Column width={4}></Grid.Column>
                    <Grid.Column width={4}></Grid.Column>
                </Grid.Row>
                {form}
                <Grid.Row columns={2}>
                    {generateLTMJsonColumn}
                    {generateGTMJsonColumn}
                </Grid.Row>
            </Grid >
        );
    }
}

export default LTMForm;