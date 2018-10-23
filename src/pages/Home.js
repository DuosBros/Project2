import React from 'react';
import { Grid, List } from 'semantic-ui-react';

export default class Home extends React.Component {

    openUrlInNewTab = (url) => {
        var win = window.open(url, '_blank');
        win.focus();
    }
    render() {
        return (
            <div>
                <Grid columns={4}>
                    <Grid.Column width='3'>
                        <List link>
                            <List.Item>
                                <List.Icon name='caret right' />
                                <List.Content>
                                    <List.Header as='a' onClick={() => this.openUrlInNewTab("https://my.gvcgroup.com/")}>Main</List.Header>
                                    <List.List>
                                        <List.Item>
                                            <List.Icon name='folder' />
                                            <List.Content>
                                                <List.Header>LOCO</List.Header>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Icon name='folder' />
                                            <List.Content>
                                                <List.Header>Product Matrix</List.Header>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Icon name='file' />
                                            <List.Content>
                                                <List.Header>Beholder QA Environments</List.Header>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Icon name='gitlab' />
                                            <List.Content>
                                                <List.Header>Dashboard | GitLab</List.Header>
                                            </List.Content>
                                        </List.Item>
                                    </List.List>
                                </List.Content>
                            </List.Item>
                        </List>
                    </Grid.Column>
                    <Grid.Column width='3'>
                        pica
                    </Grid.Column>
                    <Grid.Column width='3'>
                        pica
                    </Grid.Column>
                    <Grid.Column width='4'>
                        pica
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}