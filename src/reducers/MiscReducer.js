import { GET_ENVIRONMENTS } from '../utils/constants';

const initialState = {
    environments: { success: true }
}

const MiscReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ENVIRONMENTS:
            // sort the data for distinct values for GT
            if (action.payload.success && action.payload.data) {
                action.payload.data = action.payload.data.sort((a, b) => (a.Name > b.Name) ? 1 : -1)
            }
            return Object.assign({}, state, { environments: action.payload })
        default:
            return state;
    }
}

export default MiscReducer;
