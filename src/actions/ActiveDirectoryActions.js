import { GET_ACTIVEDIRECTORIES, CREATE_ACTIVEDIRECTORY, EDIT_ACTIVEDIRECTORY, DELETE_ACTIVEDIRECTORY } from '../constants/ActiveDirectoryConstants';

export function getActiveDirectoriesAction(payload) {
    return {
        payload,
        type: GET_ACTIVEDIRECTORIES
    }
}

export function createActiveDirectoryAction(payload) {
    return {
        payload,
        type: CREATE_ACTIVEDIRECTORY
    }
}

export function editActiveDirectoryAction(payload) {
    return {
        payload,
        type: EDIT_ACTIVEDIRECTORY
    }
}

export function deleteActiveDirectoryAction(payload) {
    return {
        payload,
        type: DELETE_ACTIVEDIRECTORY
    }
}
