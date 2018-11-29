import { GET_DISME_APPLICATIONS } from '../constants/RolloutStatusConstants';

const initialState = {
    dismeApplications: []
}

const RolloutStatusReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DISME_APPLICATIONS:
            return Object.assign({}, state, { dismeApplications: action.payload })
        default:
            return state;
    }
}

export default RolloutStatusReducer;
