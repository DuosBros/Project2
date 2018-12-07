import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import { getServers } from '../requests/ServerAxios';
import { getServersAction } from '../actions/ServerActions';
import ServersTable from '../components/ServersTable';
import { getServerState, getDismeState } from '../utils/HelperFunction';

class Servers extends React.Component {

    componentDidMount() {
        getServers()
            .then(res => {
                this.props.getServersAction(res.data.map(server => {
                    server.ServerState = getServerState(server.ServerStateID)
                    server.Disme = getDismeState(server.Disme)
                    return server
                }))
            })
    }
    render() {
        if (this.props.serverStore.servers === null) {
            return (
                <div className="centered">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching servers</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            )
        }
        else {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Servers
                            </Header>
                            <Segment attached='bottom' >
                                <ServersTable defaultLimitOverride={50} data={this.props.serverStore.servers} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        serverStore: state.ServerReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getServersAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Servers);
