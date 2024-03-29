import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    getDefaultLTMConfigAction, getServiceDetailsByShortcutsAction,
    searchServiceShortcutAction, getServicesAction, fetchLTMJsonAction,
    fetchGTMJsonAction, searchServersAction, fetchNonProdGTMJsonAction
} from '../utils/actions';
import { ROUTE_ADMIN_LTMGTM } from '../utils/constants';
import NotFound from '../pages/NotFound';
import LTMGTM from '../pages/LTMGTM';
import { getDefaultLTMConfig, fetchLTMJson, fetchGTMJson } from '../requests/LTMGTMAxios';
import { getServiceDetailsByShortcutHandler, getServicesHandler, handleServiceShortcutSearch } from '../handlers/ServiceHandler';
import { searchServerByIp, searchServers } from '../requests/HeaderAxios';
import { LTMB2CTYPES, DEFAULT_TEAMS } from '../appConfig';
import { isValidIPv4 } from '../utils/HelperFunction';

class LTMGTMContainer extends React.PureComponent {

    state = {
        team: "B2C",
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
        handleServiceShortcutSearch(e, this.props.searchServiceShortcutAction)
    }

    fetchAllData = () => {
        let pathname = this.props.location.pathname;
        if (pathname === ROUTE_ADMIN_LTMGTM) {
            this.getDefaultsAndHandleData(this.state.team);
            getServicesHandler(this.props.getServicesAction)

        }
    }

    getDefaultsAndHandleData = (team) => {
        this.setState({ team: team });
        getDefaultLTMConfig(team)
            .then(res => {
                this.props.getDefaultLTMConfigAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getDefaultLTMConfigAction({ success: false, error: err })
            })
    }

    fetchLTM = (data) => {
        this.props.fetchLTMJsonAction({ success: true, isFetching: true })
        let payload = {};
        payload.Type = data.Type
        payload.Service = data.Service
        payload.Team = this.state.team

        if (data.Type === LTMB2CTYPES[1].value || this.state.team === DEFAULT_TEAMS[1].value) {
            payload.Url = data.state.url
            payload.Https = data.state.https
            payload.Oneconnect = data.state.oneconnect
            payload.Ext = data.state.ext
            payload.Redirect = data.state.redirect
            payload.Port = data.state.port
            payload.Persistence = data.state.persistence
            payload.MonitorType = data.state.monitorType
            payload.MonitorNamePostfix = data.state.monitorNamePostfix
            payload.MonitorCodeEndpoint = data.state.monitorCodeEndpoint
            payload.MonitorResponse = data.state.monitorResponse
            payload.MonitorInterval = data.state.monitorInterval
            payload.MonitorTimeout = data.state.monitorTimeout
            payload.Lb = data.state.loadbalancers
            if (data.state.monitorName !== this.props.ltmgtmStore.ltmDefault.data.MonitorName) {
                payload.MonitorName = data.state.monitorName
            }
            payload.HTTP_Profile = data.state.httpProfile
            payload.SSL_Profile = data.state.sslProfile
            payload.RedirectRedirectWeb = data.state.redirectRedirectWeb
        }

        fetchLTMJson(payload)
            .then(res => {
                this.props.fetchLTMJsonAction({ success: true, data: res.data, isFetching: false })
            })
            .catch(err => {
                this.props.fetchLTMJsonAction({ success: false, error: err, isFetching: false })
            })
    }

    fetchGTM = (data, isProd) => {
        let payload;
        if (data.ltm) {
            payload = {
                ltm: data.ltm
            }
        }
        else {
            payload = data
        }

        this.props.fetchGTMJsonAction({ success: true, isFetching: true })
        fetchGTMJson(payload)
            .then(res => {
                if (isProd) {
                    this.props.fetchGTMJsonAction({ success: true, data: res.data, isFetching: false })
                }
                else {
                    this.props.fetchNonProdGTMJsonAction({ success: true, data: res.data, isFetching: false })
                }
            })
            .catch(err => {
                if (isProd) {
                    this.props.fetchGTMJsonAction({ success: false, error: err, isFetching: false })
                }
                else {
                    this.props.fetchNonProdGTMJsonAction({ success: true, error: err, isFetching: false })
                }
            })
    }

    saveJson = (payload) => {
        const fileName = new Date().toISOString()
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";

        let blob = new Blob([payload.data], { type: "octet/stream" })
        let url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = payload.payload ? (payload.payload.Service + "_" + payload.type + "_" + fileName + ".json") : (payload.type + "_" + fileName + ".json");
        a.click();
        window.URL.revokeObjectURL(url);
    }

    handleServerSearchChange = (e) => {
        if (e.target.value.length > 1) {
            this.handleSearchServers(e.target.value)
        }
    }

    handleSearchServers(value) {
        let trimed = value.trim();

        if (isValidIPv4(trimed)) {
            searchServerByIp(trimed)
                .then(res => {
                    let payload = [{
                        text: `${res.data.ServerName} (${res.data.IpAddress})`,
                        value: res.data.ServerId
                    }]

                    this.props.searchServersAction(payload)
                })
        }
        else {
            searchServers(trimed)
                .then(res => {
                    this.props.searchServersAction(res.data.map(e => ({ text: e.Name, value: e.Id })))
                })
        }

    }

    render() {
        let pathname = this.props.location.pathname;

        if (pathname === ROUTE_ADMIN_LTMGTM) {

            let labels;
            if (this.props.serviceStore.services.success && this.props.serviceStore.services.data) {
                let filtered = this.props.serviceStore.services.data.filter(x => x.Status === "active" || x.Status === "inactive");
                labels = [...new Set(filtered.map(item => item.Label).filter(Boolean).sort())];
            }

            return (
                <LTMGTM
                    getDefaultsAndHandleData={this.getDefaultsAndHandleData}
                    searchServiceShortcutsResult={this.props.headerStore.searchServiceShortcutsResult.slice(0, 10)}
                    handleServiceChange={this.handleServiceChange}
                    handleServiceShortcutSearchChange={this.handleServiceShortcutSearchChange}
                    selectedService={this.state.selectedService}
                    labels={labels}
                    fetchLTM={this.fetchLTM}
                    fetchGTM={this.fetchGTM}
                    gtmJson={this.props.ltmgtmStore.gtmJson}
                    nonProdGtmJson={this.props.ltmgtmStore.nonProdGtmJson}
                    ltmJson={this.props.ltmgtmStore.ltmJson}
                    saveJson={this.saveJson}
                    defaults={this.props.ltmgtmStore.ltmDefault}
                    team={this.state.team}
                    searchServerResult={this.props.headerStore.searchServerResult}
                    handleServerSearchChange={this.handleServerSearchChange} />
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
        ltmgtmStore: state.LTMGTMReducer,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getDefaultLTMConfigAction,
        getServiceDetailsByShortcutsAction,
        searchServiceShortcutAction,
        getServicesAction,
        fetchLTMJsonAction,
        fetchGTMJsonAction,
        searchServersAction,
        fetchNonProdGTMJsonAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LTMGTMContainer);
