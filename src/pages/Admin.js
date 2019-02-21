import React from 'react';
import { Grid, Header, Segment, List } from 'semantic-ui-react';

const Admin = () => {
    return (
        <Grid stackable>
            <Grid.Row>
                <Grid.Column>
                    <Header block attached='top' as='h4'>
                        Admin
                        </Header>
                    <Segment attached='bottom' >
                    <Grid stackable>
                            <Grid.Row>
                                <Grid.Column>
                                    <List divided relaxed>
                                        <List.Item>
                                            <List.Icon name='area graph' size='large' verticalAlign='middle' />
                                            <List.Content>
                                                <List.Header as='a' href='/admin/loadbalancer'>Admin LoadBalancers</List.Header>
                                                <List.Description>Admin tasks related to loadbalancers</List.Description>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Icon name='area graph' size='large' verticalAlign='middle' />
                                            <List.Content>
                                                <List.Header as='a' href='/admin/activedirectory'>Admin ActiveDirectory</List.Header>
                                                <List.Description>Admin tasks related to Active Directory</List.Description>
                                            </List.Content>
                                        </List.Item>
                                    </List>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        </Segment>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default Admin;