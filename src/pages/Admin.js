import React from 'react';
import { Grid, Header, Segment, List } from 'semantic-ui-react';
import links from '../links';
import { Link } from 'react-router-dom';

const Admin = () => {
    let locoUrl
    links.list.forEach(x => x.forEach(y => y.items.forEach(z => { if (z.title === "LOCO") { locoUrl = z.url } })))
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
                                                <List.Header as={Link} to='/admin/loadbalancer'>Admin LoadBalancers</List.Header>
                                                <List.Description>Admin tasks related to loadbalancers</List.Description>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Icon name='area graph' size='large' verticalAlign='middle' />
                                            <List.Content>
                                                <List.Header as={Link} to='/admin/activedirectory'>Admin ActiveDirectory</List.Header>
                                                <List.Description>Admin tasks related to Active Directory</List.Description>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Icon name='area graph' size='large' verticalAlign='middle' />
                                            <List.Content>
                                                <List.Header as='a' target='_blank' href={locoUrl + '/hangfire'}>Hangfire</List.Header>
                                                <List.Description>Hangfire dashboard</List.Description>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Icon name='book' size='large' verticalAlign='middle' />
                                            <List.Content>
                                                <List.Header as='a' target='_blank' href={locoUrl + '/swagger'}>LOCO API Documentation</List.Header>
                                                <List.Description>Swagger</List.Description>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Icon name='cog' size='large' verticalAlign='middle' />
                                            <List.Content>
                                                <List.Header as={Link} to={'/admin/agentlogs'}>Agent Logs</List.Header>
                                                <List.Description>Agent logs</List.Description>
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