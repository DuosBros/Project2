import { GET_SERVICE_DETAILS } from '../contants/ServiceConstatnts';

const serviceInitialState = {
    serviceDetails: {}
}

const ServiceReducer = (state = serviceInitialState, action) => {
    switch (action.type) {
        case GET_SERVICE_DETAILS:
            return Object.assign({}, state, { serviceDetails: action.payload })
        default:
            return state;
    }
}

export default ServiceReducer;