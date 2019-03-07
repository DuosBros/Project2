import React from 'react';
import { Button, Modal, List } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { toggleNotAuthorizedModalAction } from '../utils/actions';

class NotAuthorized extends React.Component {

    closeModal = () => {
        this.props.parentAction()
    }

    render() {
        return (
            <Modal
                size='mini'
                open={this.props.show}
                closeOnEscape={true}
                closeOnDimmerClick={false}
                closeIcon={true}
                onClose={() => this.closeModal()}
            >
                <Modal.Header>Not Authorized</Modal.Header>
                <Modal.Content>
                    Seems like you are missing some rights. <br />
                    Contact <a href="mailto:SportsB2CLeanOpsLOB2C1@bwinparty.com">VIE LeanOps</a> for further assistance.
                    <br />
                    <List  verticalAlign='middle'>
                        <List.Item>
                            <List.Content floated='left'>Identity: </List.Content>
                            <List.Content floated='right'>
                                {this.props.userDetails.Identity}
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Content floated='left'>Authenticated: </List.Content>
                            <List.Content floated='right'>
                                {this.props.userDetails.IsAuthenticated ? 'true' : 'false'}
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Content floated='left'>Loco User: </List.Content>
                            <List.Content floated='right'>
                                {this.props.userDetails.IsLocoUser ? 'true' : 'false'}
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Content floated='left'>Loco Admin: </List.Content>
                            <List.Content floated='right'>
                                {this.props.userDetails.IsLocoAdmin ? 'true' : 'false'}
                            </List.Content>
                        </List.Item>
                    </List>
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
        )
    }
}

function mapStateToProps(state) {
    return {
        baseStore: state.BaseReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleNotAuthorizedModalAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NotAuthorized);