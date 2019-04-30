import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    getPatchGroupsAction, getPatchGroupDetailsAction, getPatchGroupServersAction,
} from '../utils/actions';
import { ROUTE_PATCHGROUPS, ROUTE_PATCHGROUP_DETAILS } from '../utils/constants';
import NotFound from '../pages/NotFound';
import { getPatchGroups, getPatchGroupDetails, getPatchGroupServers } from '../requests/PatchGroupAxios';
import PatchGroups from '../pages/PatchGroups';
import { getServerState, getDismeState } from '../utils/HelperFunction';
import PatchGroupDetails from '../pages/PatchGroupDetails';

class PatchgroupContainer extends React.PureComponent {

    componentDidMount() {
        let pathname = this.props.location.pathname;
        if (pathname === ROUTE_PATCHGROUPS) {
            this.fetchPatchGroupsAndHandleResult();
        }
        else if (this.isCurrentlyOnPatchGroupDetails()) {
            this.updatePatchGroupDetails();
        }
    }

    updatePatchGroupDetails = () => {
        this.fetchPatchGroupDetailsAndHandleResult();
        this.fetchPatchGroupServersAndHandleResult();
    }

    fetchPatchGroupDetailsAndHandleResult = () => {
        var id = this.props.match.params.id;

        getPatchGroupDetails(id)
            .then(res => {
                this.props.getPatchGroupDetailsAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getPatchGroupDetailsAction({ success: false, error: err })
            })
    }

    fetchPatchGroupServersAndHandleResult = () => {
        var id = this.props.match.params.id;
        getPatchGroupServers(id)
            .then(res => {
                this.props.getPatchGroupServersAction({
                    success: true, data: res.data.map(server => {
                        server.ServerState = getServerState(server.ServerStateID)
                        server.Disme = getDismeState(server.Disme)
                        return server
                    })
                })
            })
            .catch(err => {
                this.props.getPatchGroupServersAction({ success: false, error: err })
            })
    }

    isCurrentlyOnPatchGroupDetails = () => {
        return this.props.location.pathname.replace(this.props.match.params.id, ":id") === ROUTE_PATCHGROUP_DETAILS ? true : false;
    }

    fetchPatchGroupsAndHandleResult = () => {
        getPatchGroups()
            .then(res => {
                this.props.getPatchGroupsAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getPatchGroupsAction({ success: false, error: err })
            })
    }


    render() {
        let pathname = this.props.location.pathname;

        if (pathname === ROUTE_PATCHGROUPS) {
            return (
                <PatchGroups
                    patchGroups={this.props.patchGroupStore.patchGroups}
                    fetchPatchGroupsAndHandleResult={this.fetchPatchGroupsAndHandleResult} />
            )
        }
        else if (this.isCurrentlyOnPatchGroupDetails()) {
            return (
                <PatchGroupDetails
                    patchGroupDetails={this.props.patchGroupStore.patchGroupDetails}
                    patchGroupServers={this.props.patchGroupStore.patchGroupServers}
                    updatePatchGroupDetails={this.updatePatchGroupDetails} />
            )
        }
        else {
            // this shouldnt happen because react-router would throw NotFound component before even reaching here but you know...
            return <NotFound />
        }
    }
}

function mapStateToProps(state) {
    return {
        patchGroupStore: state.PatchGroupReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getPatchGroupsAction,
        getPatchGroupDetailsAction,
        getPatchGroupServersAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PatchgroupContainer);
