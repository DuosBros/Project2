import {
    GET_DISME_APPLICATIONS, REMOVE_SERVICE_DETAILS,
    GET_ROLLOUT_STATUS, DELETE_ALL_ROLLOUT_STATUSES, DELETE_ROLLOUT_STATUS
} from '../constants/RolloutStatusConstants';

export function getDismeApplicationsAction(payload) {
    return {
        payload,
        type: GET_DISME_APPLICATIONS
    }
}

export function removeServiceDetailsAction(payload) {
    return {
        payload,
        type: REMOVE_SERVICE_DETAILS
    }
}

export function getRolloutStatusAction(payload) {
    return {
        payload,
        type: GET_ROLLOUT_STATUS
    }
}

export function deleteAllRoloutStatusesAction() {
    return {
        type: DELETE_ALL_ROLLOUT_STATUSES
    }
}

export function deleteRolloutStatusAction(payload) {
    return {
        payload,
        type: DELETE_ROLLOUT_STATUS
    }
}