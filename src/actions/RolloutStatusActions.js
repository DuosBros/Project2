import {
    GET_DISME_APPLICATIONS,
    GET_ROLLOUT_STATUS, DELETE_ALL_ROLLOUT_STATUSES, REMOVE_ROLLOUT_STATUS
} from '../constants/RolloutStatusConstants';

export function getDismeApplicationsAction(payload) {
    return {
        payload,
        type: GET_DISME_APPLICATIONS
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

export function removeRolloutStatusAction(payload) {
    return {
        payload,
        type: REMOVE_ROLLOUT_STATUS
    }
}