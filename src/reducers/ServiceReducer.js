import { GET_SERVICE_DETAILS, TOGGLE_LOADBALANCERFARMS_TASKS, GET_SERVICES } from '../constants/ServiceConstatnts';
import { getServerState, getDismeState } from '../utils/HelperFunction';

const serviceInitialState = {
    serviceDetails: {},
    showLoadBalancerFarmsTasksModal: false,
    services: null,
    errors: []
}

const ServiceReducer = (state = serviceInitialState, action) => {
    switch (action.type) {
        case GET_SERVICE_DETAILS:
debugger
            // in case of error
            if (action.payload.success === false || action.payload.err) {
                action.payload.caller = GET_SERVICE_DETAILS;

                return Object.assign({}, state, { 
                    serviceDetails: action.payload.success, 
                    errors: [...state.errors, action.payload] 
                })
            }
            // remove the error from array
            else {
                var filteredErrors = state.errors.filter(x => {
                    return x.caller !== GET_SERVICE_DETAILS
                })
            }

            if (action.payload.Servers) {
                var mappedServers = action.payload.Servers.map(server => {
                    server.ServerState = getServerState(server.ServerStateID)
                    server.Disme = getDismeState(server.Disme)

                    return server
                })

                action.payload.Servers = mappedServers;
            }

            if (action.payload.Websites) {
                var mappedWebsites = action.payload.Websites.map(web => {
                    if (action.payload.Service[0].SiteID !== web.SiteId) {
                        web.SiteIdAlertType = "error"
                    }

                    if (web.State !== "Started") {
                        web.StateAlertType = "error"
                    }

                    return web;
                })

                action.payload.Websites = mappedWebsites;
            }

            return Object.assign({}, state, { serviceDetails: action.payload, errors: filteredErrors })
        case TOGGLE_LOADBALANCERFARMS_TASKS:
            return Object.assign({}, state, { showLoadBalancerFarmsTasksModal: !state.showLoadBalancerFarmsTasksModal })
        case GET_SERVICES:
            return Object.assign({}, state, { services: action.payload })
        default:
            return state;
    }
}

export default ServiceReducer;