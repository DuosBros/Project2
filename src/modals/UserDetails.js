import React from 'react';
import { Button, Modal, List } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { toggleUserDetailsAction } from '../utils/actions';

class UserDetails extends React.Component {

    render() {
        return (
            <Modal

                size='mini'
                open={this.props.show}
                closeOnEscape={true}
                closeIcon={true}
                onClose={() => this.props.toggleUserDetailsAction()}
            >
                <Modal.Header>User Details</Modal.Header>
                <Modal.Content>
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
                        onClick={() => this.props.toggleUserDetailsAction()}
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
        headerStore: state.HeaderReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleUserDetailsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);