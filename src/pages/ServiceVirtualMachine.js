import React from 'react';
import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import ServiceVirtualMachinesTable from '../components/ServiceVirtualMachinesTable'
import { getServiceVirtualMachinesAction } from '../utils/actions';
import { getServiceVirtualMachines } from '../requests/MiscAxios';
import ErrorMessage from '../components/ErrorMessage';

class ServiceVirtualMachine extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData = () => {
        getServiceVirtualMachines()
            .then(res => {
                this.props.getServiceVirtualMachinesAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getServiceVirtualMachinesAction({ success: false, error: err })
            })
    }

    render() {
        // in case of error
        if (!this.props.miscStore.serviceVirtualMachines.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Service Virtual Machines
                            </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.fetchData} error={this.props.miscStore.serviceVirtualMachines.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.miscStore.serviceVirtualMachines.data)) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching service virtual machines</Message.Header>
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
                            Service Virtual Machines
                            </Header>
                        <Segment attached='bottom' >
                            <ServiceVirtualMachinesTable compact="very" rowsPerPage={45} data={this.props.miscStore.serviceVirtualMachines.data} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

function mapStateToProps(state) {
    return {
        miscStore: state.MiscReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getServiceVirtualMachinesAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceVirtualMachine);