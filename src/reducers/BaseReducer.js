import {
    AUTHENTICATE, AUTHENTICATION_STARTED, AUTHENTICATION_ENDED, AUTHENTICATION_OK, AUTHENTICATION_FAIL,
    TOGGLE_NOT_AUTHORIZED_MODAL
} from '../utils/constants';

const baseInitialState = {
    currentUser: {},
    authenticationDone: false,
    authenticationFailed: false,
    showNotAuthorizedModal: false
}

const BaseReducer = (state = baseInitialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return Object.assign({}, state, { currentUser: action.payload })
        case AUTHENTICATION_STARTED:
            return Object.assign({}, state, { authenticationDone: false })
        case AUTHENTICATION_ENDED:
            return Object.assign({}, state, { authenticationDone: true })
        case AUTHENTICATION_OK:
            return Object.assign({}, state, { authenticationFailed: false })
        case AUTHENTICATION_FAIL:
            return Object.assign({}, state, { authenticationFailed: true })
        case TOGGLE_NOT_AUTHORIZED_MODAL:
            return Object.assign({}, state, { showNotAuthorizedModal: !state.showNotAuthorizedModal })
        default:
            return state;
    }
}

export default BaseReducer;