import {GET_SERVICE_DETAILS} from '../contants/ServiceConstatnts';

export function getServiceDetailsAction(payload) {
    return {
        payload,
        type: GET_SERVICE_DETAILS
    }
}