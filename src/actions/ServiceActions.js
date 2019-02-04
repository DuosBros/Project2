import { GET_SERVICE_DETAILS, TOGGLE_LOADBALANCERFARMS_TASKS, GET_SERVICES, GET_HEALTH, GET_VERSION, GET_SERVICE_DETAILS_BY_SHORTCUTS } from '../constants/ServiceConstants';

export function getServiceDetailsByShortcutsAction(payload) {
    return {
        payload,
        type: GET_SERVICE_DETAILS_BY_SHORTCUTS
    }
}


export function getServiceDetailsAction(payload) {
    return {
        payload,
        type: GET_SERVICE_DETAILS
    }
}

export function toggleLoadBalancerFarmsTasksModalAction() {
    return {
        type: TOGGLE_LOADBALANCERFARMS_TASKS
    }
}

export function getServicesAction(payload) {
    return {
        payload,
        type: GET_SERVICES
    }
}

export function getHealthAction(payload) {
    return {
        payload,
        type: GET_HEALTH
    }
}

export function getVersionAction(payload) {
    return {
        payload,
        type: GET_VERSION
    }
}
