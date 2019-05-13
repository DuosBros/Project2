import { GET_DEFAULT_LTM_CONFIG, FETCH_LTM_JSON } from '../utils/constants';

const initialState = {
    ltmDefault: { success: true },
    ltmJson: { success: true }
}

const LTMReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DEFAULT_LTM_CONFIG:
            return Object.assign({}, state, { ltmDefault: action.payload })
        case FETCH_LTM_JSON:
            return Object.assign({}, state, { ltmJson: action.payload })
        default:
            return state;
    }
}

export default LTMReducer;
