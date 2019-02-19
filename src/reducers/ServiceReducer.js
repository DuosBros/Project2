import {
    GET_SERVICE_DETAILS, TOGGLE_LOADBALANCERFARMS_TASKS,
    GET_SERVICES, GET_SERVICE_DETAILS_BY_SHORTCUTS, REMOVE_SERVICE_DETAILS,
    REMOVE_ALL_SERVICE_DETAILS
} from '../constants/ServiceConstants';
import { getServerState, getDismeState } from '../utils/HelperFunction';
import { errorColor } from '../appConfig';

const serviceInitialState = {
    showLoadBalancerFarmsTasksModal: false,
    serviceDetails: { success: true, data: [] },
    services: { success: true }
}

const ServiceReducer = (state = serviceInitialState, action) => {
    switch (action.type) {
        case REMOVE_ALL_SERVICE_DETAILS:
            return Object.assign({}, state, { serviceDetails: { success: true, data: [] } })
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
        default:
            return state;
    }
}

export default ServiceReducer;
