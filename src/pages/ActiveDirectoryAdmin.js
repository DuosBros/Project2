import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { Grid, Header, Segment, Message, Icon, Button, Input, Modal, Form, Popup } from 'semantic-ui-react';
import ErrorMessage from '../components/ErrorMessage';
import { getActiveDirectories, createActiveDirectory, editActiveDirectories, deleteActiveDirectory } from '../requests/ActiveDirectoryAxios';
import { getActiveDirectoriesAction, createActiveDirectoryAction, editActiveDirectoryAction, deleteActiveDirectoryAction } from '../actions/ActiveDirectoryActions';
import ActiveDirectoryTable from '../components/ActiveDirectoryTable';

const ActiveDirectoryModal = (props) => {
    return (
        <Modal
            size='large'
            open={props.show}
            closeOnEscape={true}
            closeIcon={true}
            onClose={() => props.toggleModal()}
        >
            <Modal.Header>{props.header}</Modal.Header>
            <Modal.Content>
                <Form>
                    <Input value={props.ADPath} onChange={props.handleInputChange} fluid />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    onClick={() => props.handleAction()}
                    positive
                    labelPosition='right'
                    icon='checkmark'
                    content='OK'
                />
                <Button
                    onClick={() => props.toggleModal()}
                    labelPosition='right'
                    icon='checkmark'
                    content='Close'
                />
            </Modal.Actions>
        </Modal>
    )
}

class ActiveDirectoryAdmin extends React.Component {

    state = {
        showModal: false,
        payload: {
            Id: null,
            ADPath: ""
        }
    }

    componentDidMount() {
        this.fetchActiveDirectoriesAndHandleResult()
    }

    fetchActiveDirectoriesAndHandleResult = () => {
        getActiveDirectories()
            .then(res => {
                this.props.getActiveDirectoriesAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getActiveDirectoriesAction({ success: false, error: err })
            })
    }

    handleInputChange = (e, { value }) => {
        var temp = Object.assign({}, this.state.payload)
        temp.ADPath = value
        this.setState({ payload: temp });
    }

    createADPath = () => {
        var payload = {
            ADPath: this.state.payload.ADPath
        }
        createActiveDirectory(payload)
            .then(() => {
                this.fetchActiveDirectoriesAndHandleResult()
            })
            .catch(err => {
                this.props.createActiveDirectoryAction({ success: false, error: err })
            })
            .finally(() => {
                this.toggleModal()
            })
    }

    editADPath = () => {
        editActiveDirectories(this.state.payload)
            .then(() => {
                this.fetchActiveDirectoriesAndHandleResult()
            })
            .catch(err => {
                this.props.editActiveDirectoryAction({ success: false, error: err })
            })
            .finally(() => {
                this.toggleModal()
            })
    }

    deleteADPath = (id) => {
        deleteActiveDirectory(id)
            .then(() => {
                this.fetchActiveDirectoriesAndHandleResult()
            })
            .catch(err => {
                this.props.deleteActiveDirectoryAction({ success: false, error: err })
            })
    }

    toggleModal = () => {
        this.setState({ showModal: !this.state.showModal });
    }

    handleAddButtonOnClick = () => {
        this.setState({ showModal: true, header: "Create AD Path", modalAction: this.createADPath });
    }

    handleEditOnClick = (payload) => {
        this.setState({ showModal: true, header: "Edit AD Path", modalAction: this.editADPath, payload: payload });
    }

    render() {

        // in case of error
        if (!this.props.activeDirectoryStore.activeDirectories.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Active Directory
                            </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.fetchActiveDirectoriesAndHandleResult} error={this.props.activeDirectoryStore.activeDirectories.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.activeDirectoryStore.activeDirectories.data)) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching active directory</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            )
        }

        let modal = null
        if (this.state.showModal) {
            modal = (
                <ActiveDirectoryModal
                    handleInputChange={this.handleInputChange}
                    handleAction={this.state.modalAction}
                    show={true}
                    toggleModal={this.toggleModal}
                    ADPath={this.state.payload.ADPath}
                    header={this.state.header} />
            )
        }

        // render page
        return (
            <Grid stackable>
                {modal}
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Active Directory
                            <Popup trigger={
                                <Icon name='question' />
                            } content='Management of AD Paths for loco agent' inverted />
                        </Header>
                        <Segment attached='bottom' >
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Button
                                            onClick={() => this.handleAddButtonOnClick()}
                                            floated='right'
                                            primary
                                            content='Create AD Path' />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <ActiveDirectoryTable
                                deleteADPath={this.deleteADPath}
                                handleEditOnClick={this.handleEditOnClick}
                                compact="very" defaultLimitOverride={0}
                                data={this.props.activeDirectoryStore.activeDirectories.data} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

function mapStateToProps(state) {
    return {
        activeDirectoryStore: state.ActiveDirectoryReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getActiveDirectoriesAction,
        createActiveDirectoryAction,
        editActiveDirectoryAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ActiveDirectoryAdmin);
