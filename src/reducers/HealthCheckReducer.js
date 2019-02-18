import { GET_HEALTHCHECKS } from '../constants/HealthCheckConstants';

const initialState = {
    healthChecks: { success: true }
}

const HealthCheckReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_HEALTHCHECKS:
            return Object.assign({}, state, { healthChecks: action.payload })
        default:
            return state;
    }
}

export default HealthCheckReducer;
