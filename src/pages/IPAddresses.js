import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import { getIPAddressesAction } from '../actions/IPAddressActions';
import { getIPAddresses } from '../requests/IPAddressAxios';
import IPAddressesTable from '../components/IPAddressesTable';
import ErrorMessage from '../components/ErrorMessage';

class IPAddresses extends React.Component {

    componentDidMount() {
        this.fetchIPAddressesAndHandleResult()
    }

    fetchIPAddressesAndHandleResult = () => {
        getIPAddresses()
            .then(res => {
                this.props.getIPAddressesAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getIPAddressesAction({ success: false, error: err })
            })
    }

    render() {
        // in case of error
        if (!this.props.ipAddressStore.ipAddresses.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                IP addresses
                            </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.fetchIPAddressesAndHandleResult} error={this.props.ipAddressStore.ipAddresses.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.ipAddressStore.ipAddresses.data)) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching IP addresses</Message.Header>
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
                            IP addresses
                        </Header>
                        <Segment attached='bottom' >
                            <IPAddressesTable
                                rowsPerPage={45}
                                data={this.props.ipAddressStore.ipAddresses.data}
                                placeholder="Fetching ip addresses"
                                compact="very" />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

function mapStateToProps(state) {
    return {
        ipAddressStore: state.IPAddressReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getIPAddressesAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IPAddresses);
