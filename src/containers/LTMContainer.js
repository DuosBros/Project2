import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    getDefaultLTMConfigAction, getServiceDetailsByShortcutsAction,
    searchServiceShortcutAction, getServicesAction, fetchLTMJsonAction
} from '../utils/actions';
import { ROUTE_ADMIN_LTM } from '../utils/constants';
import NotFound from '../pages/NotFound';
import LTM from '../pages/LTM';
import { getDefaultLTMConfig, fetchLTMJson } from '../requests/LTMAxios';
import { getServiceDetailsByShortcutHandler, getServicesHandler } from '../handlers/ServiceHandler';
import { searchServiceShortcut } from '../requests/HeaderAxios';

class LTMContainer extends React.PureComponent {

    state = {
        team: "b2c",
        selectedService: "",
    }

    componentDidMount() {
        this.fetchAllData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location.key !== this.props.location.key) {
            this.fetchAllData()
        }
    }

    handleServiceChange = async (e, m) => {
        var value = m.options.find(x => x.value === m.value).text;
        await getServiceDetailsByShortcutHandler(value, this.props.getServiceDetailsByShortcutsAction);
        this.setState({ selectedService: value });
    }

    handleServiceShortcutSearchChange = (e) => {
        if (e.target.value.length > 1) {
            this.handleSearchServiceShortcut(e.target.value)
        }
    }

    handleSearchServiceShortcut(value) {
        searchServiceShortcut(value)
            .then(res => {
                this.props.searchServiceShortcutAction(res.data.map(e => ({ text: e.Name, value: e.Id })))
            })
        // no catch because it can throw errors while user is typing
    }

    fetchAllData = () => {
        let pathname = this.props.location.pathname;
        if (pathname === ROUTE_ADMIN_LTM) {
            this.getDefaultsAndHandleData(this.state.team);
            getServicesHandler(this.props.getServicesAction)

        }
    }

    getDefaultsAndHandleData = (team) => {
        getDefaultLTMConfig(team)
            .then(res => {
                this.props.getDefaultLTMConfigAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getDefaultLTMConfigAction({ success: false, error: err })
            })
    }

    fetchLTM = (payload) => {
        fetchLTMJson(payload)
            .then(res => {
                this.props.fetchLTMJsonAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.fetchLTMJsonAction({ success: false, error: err })
            })
    }

    saveLTMJson = (payload) => {
        const fileName = new Date().toISOString() + "_" + document.title
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";

        let blob = new Blob([payload.data], { type: "octet/stream" })
        let url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = payload.payload.Service + "_LTM_" + fileName + ".json";
        a.click();
        window.URL.revokeObjectURL(url);
    }

    render() {
        let pathname = this.props.location.pathname;

        if (pathname === ROUTE_ADMIN_LTM) {

            let labels;
            if (this.props.serviceStore.services.success && this.props.serviceStore.services.data) {
                let filtered = this.props.serviceStore.services.data.filter(x => x.Status === "active" || x.Status === "inactive");
                labels = [...new Set(filtered.map(item => item.Label).filter(Boolean).sort())];
            }

            return (
                <LTM
                    getDefaultsAndHandleData={this.getDefaultsAndHandleData}
                    searchServiceShortcutsResult={this.props.headerStore.searchServiceShortcutsResult.slice(0, 10)}
                    handleServiceChange={this.handleServiceChange}
                    handleServiceShortcutSearchChange={this.handleServiceShortcutSearchChange}
                    selectedService={this.state.selectedService}
                    labels={labels}
                    fetchLTM={this.fetchLTM}
                    ltmJson={this.props.ltmStore.ltmJson}
                    saveLTMJson={this.saveLTMJson} />
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
        loadbalancerFarmsStore: state.LoadBalancerFarmsReducer,
        headerStore: state.HeaderReducer,
        serviceStore: state.ServiceReducer,
        ltmStore: state.LTMReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getDefaultLTMConfigAction,
        getServiceDetailsByShortcutsAction,
        searchServiceShortcutAction,
        getServicesAction,
        fetchLTMJsonAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LTMContainer);
