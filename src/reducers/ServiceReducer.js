import {
    GET_SERVICE_DETAILS, TOGGLE_LOADBALANCERFARMS_TASKS,
    GET_SERVICES, GET_SERVICE_DETAILS_BY_SHORTCUTS, REMOVE_SERVICE_DETAILS,
    REMOVE_ALL_SERVICE_DETAILS,
    GET_HIGHAVAILABILITIES
} from '../utils/constants';
import { getServerState, getDismeState } from '../utils/HelperFunction';
import { errorColor } from '../appConfig';

const serviceInitialState = {
    showLoadBalancerFarmsTasksModal: false,
    serviceDetails: { success: true },
    services: { success: true }
}

const ServiceReducer = (state = serviceInitialState, action) => {
    switch (action.type) {
        case REMOVE_ALL_SERVICE_DETAILS:
            return Object.assign({}, state, { serviceDetails: { success: true } })
        case REMOVE_SERVICE_DETAILS:
            return Object.assign({}, state, {
                serviceDetails: {
                    success: true, data: state.serviceDetails.data.filter(x => {
                        return x.Service[0].Shortcut !== action.payload.Shortcut
                    })
                }
            })
        case GET_SERVICE_DETAILS_BY_SHORTCUTS:
            return Object.assign({}, state, { serviceDetails: action.payload })
        case GET_SERVICE_DETAILS:
            if (action.payload.success && action.payload.data.Servers) {
                var mappedServers = action.payload.data.Servers.map(server => {
                    if (server.IPs) {
                        server.IPs = server.IPs.map((ip) => {
                            return ip.IpAddress
                        });
                    }
                    server.ServerState = getServerState(server.ServerStateID)
                    server.Disme = getDismeState(server.Disme)

                    return server
                })

                action.payload.data.Servers = mappedServers;
            }

            if (action.payload.success && action.payload.data.Websites) {
                var mappedWebsites = action.payload.data.Websites.map(web => {
                    if (action.payload.data.Service[0].SiteID !== web.SiteId) {
                        web.SiteIdAlert = { backgroundColor: errorColor }
                    }

                    if (web.State !== "Started") {
                        web.StateAlert = { backgroundColor: errorColor }
                    }

                    return web;
                })

                action.payload.data.Websites = mappedWebsites;
            }
            return Object.assign({}, state, { serviceDetails: action.payload })
        case TOGGLE_LOADBALANCERFARMS_TASKS:
            return Object.assign({}, state, { showLoadBalancerFarmsTasksModal: !state.showLoadBalancerFarmsTasksModal })
        case GET_SERVICES:
            return Object.assign({}, state, { services: action.payload })
        case GET_HIGHAVAILABILITIES:
            var temp = Object.assign({}, state.services)

            if (temp.success && temp.data && action.payload.data) {
                action.payload.data.forEach((ha) => {
                    var index = temp.data.findIndex(x => x.Shortcut === ha.ShortCut)
                    if (index > 0) {
                        temp.data[index].isIXIAndServerCount = ha.IXI ? (
                            "true [" + ha.IXI_Server + "]") : "false"
                        temp.data[index].isTSIAndServerCount = ha.TSI ? (
                            "true [" + ha.TSI_Server + "]") : "false"
                        temp.data[index].isInIXI = ha.IXI
                        temp.data[index].isInTSI = ha.TSI
                        if (ha.HA === true) temp.data[index].isHA = "true"
                        if (ha.HA === false) temp.data[index].isHA = "false"
                        temp.data[index].IXIServersCount = ha.IXI_Server
                        temp.data[index].TSIServersCount = ha.TSI_Server
                    }
                });
            }

            return Object.assign({}, state, { services: temp })

        default:
            return state;
    }
}

export default ServiceReducer;
