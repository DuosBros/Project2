import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getServers } from '../requests/ServerAxios';
import { getServersAction } from '../utils/actions';
import ServersAdmin from '../pages/ServersAdmin';
import { ROUTE_SERVERS_ADMIN, ROUTE_SERVERS } from '../utils/constants';
import Servers from '../pages/Servers';

class ServersContainer extends React.PureComponent {

    componentDidMount() {
        this.fetchServersAndHandleResult()
    }

    fetchServersAndHandleResult = () => {
        getServers()
            .then(res => {
                this.props.getServersAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getServersAction({ success: false, error: err })
            })
    }

    render() {
        let pathname = this.props.location.pathname;

        if (pathname === ROUTE_SERVERS_ADMIN) {
            return (
                <ServersAdmin servers={this.props.serverStore.servers} fetchServersAndHandleResult={this.fetchServersAndHandleResult} />
            )
        }
        else if (pathname === ROUTE_SERVERS) {
            return (
                <Servers servers={this.props.serverStore.servers} fetchServersAndHandleResult={this.fetchServersAndHandleResult} />
            )
        }
        else {
            return;
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

export default connect(mapStateToProps, mapDispatchToProps)(ServersContainer);
