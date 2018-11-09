import { GET_SERVER_DETAILS, GET_VM_DETAILS, GET_SERVER_SCOM_ALERTS } from '../contants/ServerConstants';

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