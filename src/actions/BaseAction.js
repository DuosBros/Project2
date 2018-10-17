import {AUTHENTICATE} from '../contants/BaseConstants';

export function authenticateAction(payload) {
    return {
        payload,
        type: AUTHENTICATE
    }
}