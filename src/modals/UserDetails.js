import React, { useState } from 'react';
import { Button, Modal, List } from 'semantic-ui-react';

import Henlo from '../components/Henlo';

const UserDetails = (props) => {

    const [count, setCount] = useState(0);

    return (
        <Modal
            size='mini'
            open={props.show}
            closeOnEscape={true}
            closeIcon={true}
            onClose={() => props.toggleUserDetailsAction()}
        >
            {count === 2 && <Henlo show={true} />}
            <Modal.Header>User Details</Modal.Header>
            <Modal.Content>
                <List verticalAlign='middle'>
                    <List.Item>
                        <List.Content floated='left'>Identity: </List.Content>
                        <List.Content onClick={() => setCount(count + 1)} floated='right'>
                            {props.userDetails.Identity}
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content floated='left'>Authenticated: </List.Content>
                        <List.Content floated='right'>
                            {props.userDetails.IsAuthenticated ? 'true' : 'false'}
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content floated='left'>Loco User: </List.Content>
                        <List.Content floated='right'>
                            {props.userDetails.IsLocoUser ? 'true' : 'false'}
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content floated='left'>Loco Admin: </List.Content>
                        <List.Content floated='right'>
                            {props.userDetails.IsLocoAdmin ? 'true' : 'false'}
                        </List.Content>
                    </List.Item>
                </List>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    onClick={() => props.toggleUserDetailsAction()}
                    positive
                    labelPosition='right'
                    icon='checkmark'
                    content='Close'
                />
            </Modal.Actions>
        </Modal>
    )
}

export default UserDetails;