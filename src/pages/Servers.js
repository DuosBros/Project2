import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import { getServers } from '../requests/ServerAxios';
import { getServersAction } from '../actions/ServerActions';
import ServersTable from '../components/ServersTable';
import { getServerState, getDismeState } from '../utils/HelperFunction';
import ErrorMessage from '../components/ErrorMessage';
import { APP_TITLE } from '../appConfig';

class Servers extends React.Component {

    componentDidMount() {
        this.fetchServersAndHandleResult()

        document.title = APP_TITLE + "Servers"
    }

    fetchServersAndHandleResult = () => {
        getServers()
            .then(res => {
                this.props.getServersAction(
                    {
                        success: true,
                        data: res.data.map(server => {
                            server.ServerState = getServerState(server.ServerStateID)
                            server.Disme = getDismeState(server.Disme)
                            return server
                        })
                    })
            })
            .catch(err => {
                this.props.getServersAction({ success: false, error: err })
            })
    }

    render() {

        // in case of error
        if (!this.props.serverStore.servers.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Servers
                            </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.fetchServersAndHandleResult} error={this.props.serverStore.servers.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.serverStore.servers.data)) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching servers</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            )
        }

        // render page
        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Servers
                            </Header>
                        <Segment attached='bottom' >
                            <ServersTable rowsPerPage={50} data={this.props.serverStore.servers.data} compact="very" shouldIPColumnRender={false} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
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
