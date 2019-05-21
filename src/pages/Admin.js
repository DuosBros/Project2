import React from 'react';
import { Grid, Header, Segment, List } from 'semantic-ui-react';
import links from '../links';
import { Link } from 'react-router-dom';
import { APP_TITLE } from '../appConfig';
import { ROUTE_ADMIN_LTM } from '../utils/constants';

const Admin = (props) => {
    let locoUrl;
    document.title = APP_TITLE + "Admin";
    links.list.forEach(x => x.forEach(y => y.items.forEach(z => { if (z.title === "LOCO") { locoUrl = z.url } })))
    let items = (
        <>
            {props.isAdmin && (
                <>
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
                </>
            )}

            <List.Item>
                <List.Icon name='cog' size='large' verticalAlign='middle' />
                <List.Content>
                    <List.Header as={Link} to={ROUTE_ADMIN_LTM}>LTM&GTM</List.Header>
                    <List.Description>LTM&GTM config</List.Description>
                </List.Content>
            </List.Item>
        </>
    )

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
                                        {items}
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