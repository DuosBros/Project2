import { GET_SERVICE_DETAILS, TOGGLE_LOADBALANCERFARMS_TASKS } from '../contants/ServiceConstatnts';

const serviceInitialState = {
    serviceDetails: {},
    showLoadBalancerFarmsTasksModal: false
}

const ServiceReducer = (state = serviceInitialState, action) => {
    switch (action.type) {
        case GET_SERVICE_DETAILS:
            return Object.assign({}, state, { serviceDetails: action.payload })
        case TOGGLE_LOADBALANCERFARMS_TASKS:
            return Object.assign({}, state, { showLoadBalancerFarmsTasksModal: !state.showLoadBalancerFarmsTasksModal})
        default:
            return state;
    }
}

export default ServiceReducer;