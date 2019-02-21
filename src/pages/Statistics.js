import { Grid, Header, List, Segment } from "semantic-ui-react";
import React from 'react'

const Statistics = () => {
    return (
        <Grid stackable>
            <Grid.Row>
                <Grid.Column>
                    <Header block attached='top' as='h4'>
                        Statistics
                    </Header>
                    <Segment attached>
                        <Grid stackable>
                            <Grid.Row>
                                <Grid.Column>
                                    <List divided relaxed>
                                        <List.Item>
                                            <List.Icon name='area graph' size='large' verticalAlign='middle' />
                                            <List.Content>
                                                <List.Header as='a' href='/statistics/servers'>Server statistics</List.Header>
                                                <List.Description>Graphs related to servers</List.Description>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Icon name='area graph' size='large' verticalAlign='middle' />
                                            <List.Content>
                                                <List.Header as='a' href='/statistics/services'>Service statistics</List.Header>
                                                <List.Description>Graphs related to services</List.Description>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Icon name='area graph' size='large' verticalAlign='middle' />
                                            <List.Content>
                                                <List.Header as='a' href='/statistics/loadbalancerfarms'>Loadbalancer statistics</List.Header>
                                                <List.Description>Graphs related to loadbalancer farms</List.Description>
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

export default Statistics;