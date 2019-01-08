import {
    GET_SERVER_DETAILS, GET_VM_DETAILS, GET_SERVER_SCOM_ALERTS,
    GET_SERVERS, GET_DISK_USAGE_DETAILS
} from '../constants/ServerConstants';


export function getDiskUsageDetailsAction(payload) {
    return {
        payload,
        type: GET_DISK_USAGE_DETAILS
    }
}

export function getServerDetailsAction(payload) {
    return {
        payload,
        type: GET_SERVER_DETAILS
    }
}

export function getVmDetailsAction(payload) {
    return {
        payload,
        type: GET_VM_DETAILS
    }
}

export function getServerScomAlertsAction(payload) {
    return {
        payload,
        type: GET_SERVER_SCOM_ALERTS
    }
}

export function getServersAction(payload) {
    return {
        payload,
        type: GET_SERVERS
    }
}