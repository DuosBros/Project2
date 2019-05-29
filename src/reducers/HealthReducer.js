import { GET_HEALTHCHECKS } from '../utils/constants';


const initialState = {
    healthChecks: { success: true }
}

const HealthReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_HEALTHCHECKS:
            return Object.assign({}, state, { healthChecks: action.payload })
        default:
            return state;
    }
}

export default HealthReducer;
