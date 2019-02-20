import {
    GET_SERVICE_DETAILS, TOGGLE_LOADBALANCERFARMS_TASKS, GET_SERVICES, GET_HEALTH, GET_VERSION,
    GET_SERVICE_DETAILS_BY_SHORTCUTS, REMOVE_SERVICE_DETAILS, REMOVE_ALL_SERVICE_DETAILS, GET_HIGHAVAILABILITIES
} from '../constants/ServiceConstants';

export function removeAllServiceDetailsAction() {
    return {
        type: REMOVE_ALL_SERVICE_DETAILS
    }
}

export function getServiceDetailsByShortcutsAction(payload) {
    return {
        payload,
        type: GET_SERVICE_DETAILS_BY_SHORTCUTS
    }
}

export function removeServiceDetailsAction(payload) {
    return {
        payload,
        type: REMOVE_SERVICE_DETAILS
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

export function getHighAvailabilitiesAction(payload) {
    return {
        payload,
        type: GET_HIGHAVAILABILITIES
    }
}