import React from 'react';
import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import ServiceVirtualMachinesTable from '../components/ServiceVirtualMachinesTable'
import ErrorMessage from '../components/ErrorMessage';
import { APP_TITLE } from '../appConfig';

class ServiceVirtualMachine extends React.Component {

    componentDidMount() {
        document.title = APP_TITLE + "Service Virtual Machines"
    }

    render() {
        // in case of error
        if (!this.props.serviceVirtualMachines.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Service Virtual Machines
                            </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.fetchServicesAndHighAvailabilitiesAndHandleResult} error={this.props.serviceVirtualMachines.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.serviceVirtualMachines.data)) {
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
                            <ServiceVirtualMachinesTable compact="very" rowsPerPage={45} data={this.props.serviceVirtualMachines.data} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default ServiceVirtualMachine;