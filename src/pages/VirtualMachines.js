import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import { getVirtualMachines } from '../requests/VirtualMachineAxios';
import { getVirtualMachinesAction } from '../actions/VirtualMachineAction';
import VirtualMachinesTable from '../components/VirtualMachinesTable';

class VirtualMachines extends React.Component {

    componentDidMount() {
        getVirtualMachines()
            .then(res => {
                this.props.getVirtualMachinesAction(res.data)
            })
    }
    render() {
        if (this.props.virtualMachineStore.virtualMachines === null) {
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
        else {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Virtual Machines
                            </Header>
                            <Segment attached='bottom' >
                                <VirtualMachinesTable compact="very" defaultLimitOverride={50} data={this.props.virtualMachineStore.virtualMachines} />
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
        virtualMachineStore: state.VirtualMachineReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getVirtualMachinesAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(VirtualMachines);
