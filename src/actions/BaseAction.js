import {AUTHENTICATE, AUTHENTICATION_STARTED, AUTHENTICATION_ENDED, AUTHENTICATION_OK, AUTHENTICATION_FAIL,
    TOGGLE_NOT_AUTHORIZED_MODAL} from '../contants/BaseConstants';

export function authenticateAction(payload) {
    return {
        payload,
        type: AUTHENTICATE
    }
}

export function authenticationStartedAction() {
    return {
        type: AUTHENTICATION_STARTED
    }
}

export function authenticateEndedAction() {
    return {
        type: AUTHENTICATION_ENDED
    }
}

export function authenticateOKAction() {
    return {
        type: AUTHENTICATION_OK
    }
}

export function authenticationFailedAction() {
    return {
        type: AUTHENTICATION_FAIL
    }
}

export function toggleNotAuthorizedModalAction() {
    return {
        type: TOGGLE_NOT_AUTHORIZED_MODAL
    }
}