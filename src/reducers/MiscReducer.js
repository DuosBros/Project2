import { GET_ENVIRONMENTS, GET_SERVICE_VIRTUALMACHINES } from '../utils/constants';

const initialState = {
    environments: { success: true },
    serviceVirtualMachines: { success: true },
    stages: { success: true }
}

const MiscReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ENVIRONMENTS:
            // sort the data for distinct values for GT
            if (action.payload.success && action.payload.data) {
                action.payload.data = action.payload.data.sort((a, b) => (a.Name > b.Name) ? 1 : -1)
            }
            return Object.assign({}, state, { environments: action.payload })
        case GET_SERVICE_VIRTUALMACHINES:
            return Object.assign({}, state, { serviceVirtualMachines: action.payload })
        default:
            return state;
    }
}

export default MiscReducer;
