import { GET_IPADDRESSES } from '../constants/IPAddressConstants';

const initialState = {
    ipAddresses: { success: true }
}

const IPAddressReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_IPADDRESSES:
            return Object.assign({}, state, { ipAddresses: action.payload })
        default:
            return state;
    }
}

export default IPAddressReducer;
