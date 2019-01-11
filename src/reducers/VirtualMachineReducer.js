import { GET_VIRTUALMACHINES } from '../constants/VirtualMachineConstants';

const initialState = {
    virtualMachines: { success: true }
}

const VirtualMachineReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_VIRTUALMACHINES:
            return Object.assign({}, state, { virtualMachines: action.payload })
        default:
            return state;
    }
}

export default VirtualMachineReducer;
