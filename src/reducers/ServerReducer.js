import { GET_SERVER_DETAILS, GET_VM_DETAILS, GET_SERVER_SCOM_ALERTS } from '../contants/ServerConstants';

const serverInitialState = {
    serverDetails: {},
    vmDetails: {},
    scomAlerts: {}
}

const ServerReducer = (state = serverInitialState, action) => {
    switch (action.type) {
        case GET_SERVER_DETAILS:
            return Object.assign({}, state, { serverDetails: action.payload })
        case GET_VM_DETAILS:
            return Object.assign({}, state, { vmDetails: action.payload })
        case GET_SERVER_SCOM_ALERTS:
            return Object.assign({}, state, { scomAlerts: action.payload })
        default:
            return state;
    }
}

export default ServerReducer;