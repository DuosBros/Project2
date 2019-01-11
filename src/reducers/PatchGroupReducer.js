import { GET_PATCHGROUPS } from '../constants/PatchGroupConstants';

const initialState = {
    patchGroups: { success: true }
}

const PatchGroupReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PATCHGROUPS:
            return Object.assign({}, state, { patchGroups: action.payload })
        default:
            return state;
    }
}

export default PatchGroupReducer;
