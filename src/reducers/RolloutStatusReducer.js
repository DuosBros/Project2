import {
    GET_DISME_APPLICATIONS, GET_SERVICE_DETAILS_BY_SHORTCUTS, REMOVE_SERVICE_DETAILS,
    GET_ROLLOUT_STATUS
} from '../constants/RolloutStatusConstants';

const initialState = {
    dismeApplications: [],
    serviceDetails: [],
    rolloutStatuses: []
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
                }),
                rolloutStatuses: state.rolloutStatuses.filter(x => {
                    return x.serviceName !== action.payload.Shortcut
                })
            })
        case GET_ROLLOUT_STATUS:

            var pica = state.rolloutStatuses.filter(x => {
                if (x.serviceName === action.payload.serviceName) {
                    x.rolloutStatus = action.payload.rolloutStatus;
                    return x;
                }
            })
            if (pica.length > 0) {
                var copy = Object.assign([], state, {
                    rolloutStatuses: pica
                })
                return copy;
            }
            else {
                return Object.assign({}, state, { rolloutStatuses: [...state.rolloutStatuses, action.payload] })
            }

        default:
            return state;
    }
}

export default RolloutStatusReducer;
