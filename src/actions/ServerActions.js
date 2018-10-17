import {GET_SERVER_DETAILS} from '../contants/ServerConstants';

export function getServerDetailsAction(payload) {
    return {
        payload,
        type: GET_SERVER_DETAILS
    }
}