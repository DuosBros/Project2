import { GET_DISME_APPLICATIONS } from '../constants/RolloutStatusConstants';

export function getDismeApplicationsActions(payload) {
    return {
        payload,
        type: GET_DISME_APPLICATIONS
    }
}