import { GET_SERVER_DETAILS, GET_VM_DETAILS } from '../contants/ServerConstants';

const serverInitialState = {
    serverDetails: {},
    vmDetails: {},
}

const ServerReducer = (state = serverInitialState, action) => {
    switch (action.type) {
        case GET_SERVER_DETAILS:
            return Object.assign({}, state, { serverDetails: action.payload })
        case GET_VM_DETAILS:
            return Object.assign({}, state, { vmDetails: action.payload })
        default:
            return state;
    }
}

export default ServerReducer;