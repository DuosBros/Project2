import { Modal, Button, Grid, Dropdown, Input, Form, Label, Icon, Header, Message } from "semantic-ui-react";
import React from 'react';
import { LTMB2CTYPES } from "../appConfig";
import { trimmedSearch } from "../utils/HelperFunction";
import ServerSearchMultipleDropdown from "../components/ServerSearchMultipleDropdown";
import ReactJson from "react-json-view";
import ErrorMessage from "../components/ErrorMessage";

class NonProdGTM extends React.PureComponent {
    state = {
        selectedServers: [],
        domain: "",
        isGtmJsonSegmentHidden: true,
        modifiedGTMJSON: null
    }

    closeModal = () => {
        this.props.toggleGTMModal();
    }

    handleOnchange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    handleServerSearchChange = (e) => {
        if (e.target.value.length > 1) {
            this.handleSearchServers(e.target.value)
        }
    }

    handleToggleShowingContent = (segment) => {
        this.setState({ [segment]: !this.state[segment] });
    }

    handleServerChange = (e, { options, value }) => {
        let serverToAdd = options.find(x => x.value === value[0])
        this.setState({ selectedServers: [...this.state.selectedServers, serverToAdd.text] })
    }

    handleRemoveServer = (server) => {
        var array = this.state.selectedServers.slice();
        let index = array.findIndex(x => x === server)
        array.splice(index, 1);
        this.setState({ selectedServers: array });
    }

    handleGenerateNonProdGTM = () => {
        let payload = {
            Type: this.state.type,
            Domain: this.state.domain,
            Servers: this.state.selectedServers
        }

        this.props.fetchGTM(payload, false)
    }
    render() {
        let serverLabels = this.state.selectedServers.map(x => {
            return (
                <Label key={x}>
                    {x}
                    <Icon onClick={() => this.handleRemoveServer(x)} name='delete' />
                </Label>
            )
        })

        let generateButton, GTMJson;

        if (this.state.type && this.state.domain && this.state.selectedServers.length > 0) {
            generateButton = (
                <Button onClick={this.handleGenerateNonProdGTM} primary icon='checkmark' content="Generate GTM JSON" />
            )
        }

        if (!this.props.nonProdGtmJson.success) {
            GTMJson = (
                <ErrorMessage error={this.props.nonProdGtmJson.error} />
            );
        }
        else {
            let json = JSON.stringify(this.state.modifiedGTMJSON ? this.state.modifiedGTMJSON : this.props.nonProdGtmJson.data, null, 4);

            if (!this.state.isGtmJsonSegmentHidden) {
                GTMJson = (
                    <Header block attached='top' as='h4'>
                        <Button id="skip" color="black" onClick={() => this.props.saveJson({ type: "GTM", data: json })}>
                            Download
                        </Button>
                        <Button onClick={() => this.handleToggleShowingContent("isGtmJsonSegmentHidden")} floated='right' icon='content' />
                    </Header>
                )
            }
            else if (this.props.nonProdGtmJson.isFetching) {
                GTMJson = (
                    <div className="messageBox">
                        <Message info icon>
                            <Icon name='circle notched' loading />
                            <Message.Content>
                                <Message.Header>Fetching GTM JSON</Message.Header>
                            </Message.Content>
                        </Message>
                    </div>
                );
            }
            else if (this.props.nonProdGtmJson.data) {
                GTMJson = (
                    <>
                        <Header block attached='top' as='h4'>
                            <Button id="skip" color="black" onClick={() => this.props.saveJson({ type: "GTM", data: json })}>
                                Download
                            </Button>
                            <Button onClick={() => this.handleToggleShowingContent("isGtmJsonSegmentHidden")} floated='right' icon='content' />
                        </Header>
                        <ReactJson
                            style={{ padding: '1em' }}
                            name={false}
                            theme="solarized"
                            collapseStringsAfterLength={false}
                            src={this.props.nonProdGtmJson.data}
                            collapsed={false}
                            indentWidth={4}
                            displayObjectSize={false}
                            displayDataTypes={false}
                            enableClipboard={true}
                            onDelete={this.handleEditGTMJSON}
                            onAdd={this.handleEditGTMJSON}
                            onEdit={this.handleEditGTMJSON}
                            iconStyle="square"
                        />
                    </>
                )
            }
        }

        return (
            <Modal
                size='large'
                closeOnEscape={true}
                closeOnDimmerClick={false}
                closeIcon={true}
                open={true}
                onClose={() => this.closeModal()}
            >
                <Modal.Header>Generate GTM for non-prod stage</Modal.Header>
                <Modal.Content>
                    <Grid>
                        <Grid.Row columns={3}>
                            <Grid.Column width={4}>
                                <Form>
                                    <Form.Field>
                                        <strong>Type:</strong>
                                        <Dropdown name="type" onChange={this.handleOnchange} selection options={LTMB2CTYPES} />
                                    </Form.Field>
                                    <Form.Field>
                                        <strong>Domain:</strong>
                                        <Input name="domain" onChange={this.handleOnchange} />
                                    </Form.Field>
                                </Form>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Form>
                                    <Form.Field>
                                        <strong>Servers:</strong>
                                        <ServerSearchMultipleDropdown
                                            value={this.state.selectedServers}
                                            placeholder='Type to search a server'
                                            handleServerChange={this.handleServerChange}
                                            options={this.props.searchServerResult.filter((el) => {
                                                return !this.state.selectedServers.includes(el.text);
                                            }).slice(0, 10)}
                                            handleServerSearchChange={this.props.handleServerSearchChange}
                                            search={trimmedSearch} />
                                    </Form.Field>
                                </Form>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <strong>Selected servers:</strong> <br />
                                {serverLabels}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                {GTMJson}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    {generateButton}
                    <Button
                        onClose={() => this.closeModal()}
                        labelPosition='right'
                        content='Close'
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}

export default NonProdGTM;