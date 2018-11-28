import { GET_PATCHGROUPS } from '../contants/PatchGroupConstants';

const initialState = {
    patchGroups: []
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
