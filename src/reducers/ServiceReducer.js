import { GET_SERVICE_DETAILS, TOGGLE_LOADBALANCERFARMS_TASKS, GET_SERVICES } from '../constants/ServiceConstants';
import { getServerState, getDismeState } from '../utils/HelperFunction';

const serviceInitialState = {
    serviceDetails: { success: true },
    showLoadBalancerFarmsTasksModal: false,
    services: null
}

const ServiceReducer = (state = serviceInitialState, action) => {
    switch (action.type) {
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
                        web.SiteIdAlertType = "error"
                    }

                    if (web.State !== "Started") {
                        web.StateAlertType = "error"
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
