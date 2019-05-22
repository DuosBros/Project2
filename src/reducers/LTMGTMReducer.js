import { GET_DEFAULT_LTM_CONFIG, FETCH_LTM_JSON, FETCH_GTM_JSON } from '../utils/constants';

const initialState = {
    ltmDefault: { success: true },
    ltmJson: { success: true, isFetching: false },
    gtmJson: { success: true, isFetching: false }
}

const LTMGTMReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DEFAULT_LTM_CONFIG:
            return Object.assign({}, state, { ltmDefault: action.payload })
        case FETCH_LTM_JSON:
            return Object.assign({}, state, { ltmJson: action.payload })
        case FETCH_GTM_JSON:
            return Object.assign({}, state, { gtmJson: action.payload })
        default:
            return state;
    }
}

export default LTMGTMReducer;
