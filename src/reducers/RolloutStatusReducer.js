import { GET_DISME_APPLICATIONS, GET_SERVICE_DETAILS_BY_SHORTCUTS, REMOVE_SERVICE_DETAILS } from '../constants/RolloutStatusConstants';

const initialState = {
    dismeApplications: [],
    serviceDetails: []
}

const RolloutStatusReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DISME_APPLICATIONS:
            return Object.assign({}, state, { dismeApplications: action.payload })
        case GET_SERVICE_DETAILS_BY_SHORTCUTS:
            // return Object.assign({}, state, { serviceDetails: [...state.serviceDetails, action.payload] })
            return Object.assign({}, state, { serviceDetails: action.payload })
        case REMOVE_SERVICE_DETAILS:
            return Object.assign({}, state, {
                serviceDetails: state.serviceDetails.filter(x => {
                    return x.Service[0].Shortcut !== action.payload.Shortcut
                })
            })
        default:
            return state;
    }
}

export default RolloutStatusReducer;
