import { GET_SERVER_DETAILS } from '../contants/ServerConstants';

const serverInitialState = {
    serverDetails: {}
}

const ServerReducer = (state = serverInitialState, action) => {
    switch (action.type) {
        case GET_SERVER_DETAILS:
            return Object.assign({}, state, { serverDetails: action.payload[0] })
        default:
            return state;
    }
}

export default ServerReducer;