import { GET_PATCHGROUPS } from '../constants/PatchGroupConstants';

export function getPatchGroupsAction(payload) {
    return {
        payload,
        type: GET_PATCHGROUPS
    }
}