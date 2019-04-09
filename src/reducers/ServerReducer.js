import { GET_SERVER_DETAILS, GET_VM_DETAILS, GET_SERVER_SCOM_ALERTS, GET_SERVERS, GET_SERVER_STATS,
    GET_SERVER_DEPLOYMENTS } from '../utils/constants';
import { getServerState, getDismeState } from '../utils/HelperFunction';
import { errorColor } from '../appConfig';

const serverInitialState = {
    serverDetails: { success: true },
    vmDetails: {},
    scomAlerts: { success: true },
    servers: { success: true }
}

const ServerReducer = (state = serverInitialState, action) => {
    switch (action.type) {
        case GET_SERVER_DETAILS:
            if (action.payload.data) {
                if(action.payload.data.OperatingSystem) {
                    if (action.payload.data.OperatingSystem.search(new RegExp("linux", "i")) >= 0) {
                        if (action.payload.data.VM) {
                            if (action.payload.data.VM.Status === "Running") {
                                action.payload.data.ServerStateID = 1
                            }
                        }
                    }
                }

                action.payload.data.ServerState = getServerState(action.payload.data.ServerStateID)
                action.payload.data.Disme = getDismeState(action.payload.data.Disme)

                if (action.payload.data.WindowsServices) {
                    action.payload.data.WindowsServices.map(x => {
                        if (x.State !== "Running") {
                            x.StateAlert = { backgroundColor: errorColor }
                        }

                        return x;
                    })
                }
            }

            return Object.assign({}, state, { serverDetails: action.payload })
        case GET_VM_DETAILS:
            return Object.assign({}, state, { vmDetails: action.payload })
        case GET_SERVER_SCOM_ALERTS:
            return Object.assign({}, state, { scomAlerts: action.payload })
        case GET_SERVERS:
            if(action.payload.success && action.payload.data) {
                action.payload.data = action.payload.data.map(server => {
                    server.ServerState = getServerState(server.ServerStateID)
                    server.Disme = getDismeState(server.Disme)
                    return server
                })
            }
            return Object.assign({}, state, { servers: action.payload })
        case GET_SERVER_STATS:
            var temp = Object.assign({}, state.serverDetails)
            if (temp.data) {
                temp.data.serverStats = action.payload
            }
            return Object.assign({}, state, { serverDetails: temp })
        case GET_SERVER_DEPLOYMENTS:
            temp = Object.assign({}, state.serverDetails)
            if (temp.data) {
                temp.data.deploymentStats = action.payload
            }
            return Object.assign({}, state, { serverDetails: temp })
        default:
            return state;
    }
}

export default ServerReducer;