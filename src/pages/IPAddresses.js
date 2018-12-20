import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getIPAddressesAction } from '../actions/IPAddressActions';
import { getIPAddresses } from '../requests/IPAddressAxios';
import { Grid, Header, Segment } from 'semantic-ui-react';
import IPAddressesTable from '../components/IPAddressesTable';

class IPAddresses extends React.Component {

    componentDidMount() {
        getIPAddresses()
            .then(res => {
                this.props.getIPAddressesAction(res.data)
                console.log(res.data)
            })
    }
    render() {
        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            IP addresses
                        </Header>
                        <Segment attached='bottom' >
                            <IPAddressesTable 
                                defaultLimitOverride={45} 
                                data={this.props.ipAddressStore.ipAddresses}
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
