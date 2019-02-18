import { GET_HEALTHCHECKS } from '../constants/HealthCheckConstants';

export function getHealthChecksAction(payload) {
    return {
        payload,
        type: GET_HEALTHCHECKS
    }
}