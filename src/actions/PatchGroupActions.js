import { GET_PATCHGROUPS } from '../contants/PatchGroupConstants';

export function getPatchGroupsAction(payload) {
    return {
        payload,
        type: GET_PATCHGROUPS
    }
}