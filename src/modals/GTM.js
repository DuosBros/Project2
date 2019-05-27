import { Modal, Button, Grid, Dropdown, Input, Form, Label, Icon } from "semantic-ui-react";
import React from 'react';
import { LTMB2CTYPES, DETAULT_STAGES } from "../appConfig";
import { trimmedSearch } from "../utils/HelperFunction";
import ServerSearchMultipleDropdown from "../components/ServerSearchMultipleDropdown";

class GTM extends React.PureComponent {
    state = {
        selectedServers: []
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

    render() {
        let serverLabels = this.state.selectedServers.map(x => {
            return (
                <Label key={x}>
                    {x}
                    <Icon onClick={() => this.handleRemoveServer(x)} name='delete' />
                </Label>
            )
        })
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
                                    <Form.Field>
                                        <strong>Stage:</strong>
                                        <Dropdown multiple name="type" onChange={this.handleOnchange} selection options={DETAULT_STAGES} />
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
                                {/* <Form>
                                    <Form.Field>
                                        <Form.Input></Form.Input>
                                    </Form.Field>
                                </Form> */}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClose={() => this.closeModal()}
                        positive
                        labelPosition='right'
                        icon='checkmark'
                        content='Close'
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}

export default GTM;