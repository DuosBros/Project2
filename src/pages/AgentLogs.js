import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import { getAgentLogs } from '../requests/AgentLogAxios';
import { getAgentLogsAction } from '../actions/AgentLogActions';
import ErrorMessage from '../components/ErrorMessage';
import AgentLogTable from '../components/AgentLogTable';

class AgentLogs extends React.Component {

    componentDidMount() {
        this.fetchAgentLogsAndHandleResult()
    }

    fetchAgentLogsAndHandleResult = () => {
        getAgentLogs()
            .then(res => {
                this.props.getAgentLogsAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getAgentLogsAction({ success: false, error: err })
            })
    }

    render() {

        // in case of error
        if (!this.props.agentLogStore.agentLogs.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Agent Logs
                            </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.fetchAgentLogsAndHandleResult} error={this.props.agentLogStore.agentLogs.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.agentLogStore.agentLogs.data)) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching agent logs</Message.Header>
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
                        Agent Logs
                            </Header>
                        <Segment attached='bottom' >
                            <AgentLogTable compact="very" rowsPerPage={50} data={this.props.agentLogStore.agentLogs.data} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )

    }
}

function mapStateToProps(state) {
    return {
        agentLogStore: state.AgentLogReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAgentLogsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AgentLogs);
