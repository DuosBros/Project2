import { GET_HEALTHCHECKS, GET_HEALTHS } from '../utils/constants';


const initialState = {
    healthChecks: { success: true },
    healths: { success: true }
}

const HealthReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_HEALTHCHECKS:
            return Object.assign({}, state, { healthChecks: action.payload })
        case GET_HEALTHS:
            return Object.assign({}, state, { healths: action.payload })
        default:
            return state;
    }
}

export default HealthReducer;
