import { GET_SERVER_DETAILS, GET_VM_DETAILS, GET_SERVER_SCOM_ALERTS, GET_SERVERS } from '../constants/ServerConstants';
import { getServerState, getDismeState } from '../utils/HelperFunction';

const serverInitialState = {
    serverDetails: {},
    vmDetails: {},
    scomAlerts: {},
    servers: null
}

const ServerReducer = (state = serverInitialState, action) => {
    switch (action.type) {
        case GET_SERVER_DETAILS:
            if (action.payload) {
                action.payload.ServerState = getServerState(action.payload.ServerStateID)
                action.payload.Disme = getDismeState(action.payload.Disme)
            }

            return Object.assign({}, state, { serverDetails: action.payload })
        case GET_VM_DETAILS:
            return Object.assign({}, state, { vmDetails: action.payload })
        case GET_SERVER_SCOM_ALERTS:
            return Object.assign({}, state, { scomAlerts: action.payload })
        case GET_SERVERS:
            return Object.assign({}, state, { servers: action.payload })
        default:
            return state;
    }
}

export default ServerReducer;