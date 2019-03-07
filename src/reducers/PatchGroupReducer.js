import { GET_PATCHGROUPS, GET_PATCHGROUP_DETAILS, GET_PATCHGROUP_SERVERS } from '../utils/constants';

const initialState = {
    patchGroups: { success: true },
    patchGroupDetails: { success: true },
    patchGroupServers: { success: true }
}

const PatchGroupReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PATCHGROUPS:
            return Object.assign({}, state, { patchGroups: action.payload })
        case GET_PATCHGROUP_SERVERS:
            return Object.assign({}, state, { patchGroupServers: action.payload })
        case GET_PATCHGROUP_DETAILS:
            return Object.assign({}, state, { patchGroupDetails: action.payload })
        default:
            return state;
    }
}

export default PatchGroupReducer;
