import { GET_PATCHGROUPS, GET_PATCHGROUP_DETAILS, GET_PATCHGROUP_SERVERS } from '../constants/PatchGroupConstants';

export function getPatchGroupsAction(payload) {
    return {
        payload,
        type: GET_PATCHGROUPS
    }
}

export function getPatchGroupDetailsAction(payload) {
    return {
        payload,
        type: GET_PATCHGROUP_DETAILS
    }
}

export function getPatchGroupServersAction(payload) {
    return {
        payload,
        type: GET_PATCHGROUP_SERVERS
    }
}