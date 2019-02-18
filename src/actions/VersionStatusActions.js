import { GET_STAGES, GET_VERSIONS, REMOVE_ALL_VERSIONS } from "../constants/VersionStatusConstants";

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

export function removeAllVersionsAction() {
    return {
        type: REMOVE_ALL_VERSIONS
    }
}