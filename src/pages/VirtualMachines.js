import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import { getVirtualMachines } from '../requests/VirtualMachineAxios';
import { getVirtualMachinesAction } from '../actions/VirtualMachineAction';
import VirtualMachinesTable from '../components/VirtualMachinesTable';
import ErrorMessage from '../components/ErrorMessage';
import { APP_TITLE } from '../appConfig';

class VirtualMachines extends React.Component {

    componentDidMount() {
        this.fetchVirtualMachinesAndHandleResult()

        document.title = APP_TITLE + "Virtual Machines"
    }

    fetchVirtualMachinesAndHandleResult = () => {
        getVirtualMachines()
            .then(res => {
                this.props.getVirtualMachinesAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getVirtualMachinesAction({ success: false, error: err })
            })
    }

    render() {

        // in case of error
        if (!this.props.virtualMachineStore.virtualMachines.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Virtual Machines
                            </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.fetchVirtualMachinesAndHandleResult} error={this.props.virtualMachineStore.virtualMachines.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.virtualMachineStore.virtualMachines.data)) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching virtual machines</Message.Header>
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
                            Virtual Machines
                            </Header>
                        <Segment attached='bottom' >
                            <VirtualMachinesTable compact="very" rowsPerPage={50} data={this.props.virtualMachineStore.virtualMachines.data} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )

    }
}

function mapStateToProps(state) {
    return {
        virtualMachineStore: state.VirtualMachineReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getVirtualMachinesAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(VirtualMachines);
