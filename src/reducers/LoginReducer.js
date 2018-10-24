import { SEND_AUTHENTICATION_DATA } from '../contants/LoginConstants';

const loginInitialState = {
    currentUser: {},
    authenticationDone: false,
    authenticationFailed: false
}

const LoginReducer = (state = loginInitialState, action) => {
    switch (action.type) {
        case SEND_AUTHENTICATION_DATA:
            
        default:
            return state;
    }
}

export default LoginReducer;