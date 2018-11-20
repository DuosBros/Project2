import { GET_SERVICE_DETAILS, TOGGLE_LOADBALANCERFARMS_TASKS } from '../contants/ServiceConstatnts';
import { getServerState, getDismeState } from '../utils/HelperFunction';

const serviceInitialState = {
    serviceDetails: {},
    showLoadBalancerFarmsTasksModal: false
}

const ServiceReducer = (state = serviceInitialState, action) => {
    switch (action.type) {
        case GET_SERVICE_DETAILS:
            if (action.payload.Servers) {
                var mappedServers = action.payload.Servers.map(server => {
                    server.ServerState = getServerState(server.ServerStateID)
                    server.Disme = getDismeState(server.Disme)
                    return server
                })

                action.payload.Servers = mappedServers;

            }

            return Object.assign({}, state, { serviceDetails: action.payload })
        case TOGGLE_LOADBALANCERFARMS_TASKS:
            return Object.assign({}, state, { showLoadBalancerFarmsTasksModal: !state.showLoadBalancerFarmsTasksModal })
        default:
            return state;
    }
}

export default ServiceReducer;