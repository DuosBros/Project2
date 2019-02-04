import { GET_STAGES, GET_VERSIONS } from "../constants/VersionStatusConstants";

export function getStagesAction(payload) {
    return {
        payload,
        type: GET_STAGES
    }
}

export function getVersionsAction(payload) {
    return {
        payload,
        type: GET_VERSIONS
    }
}