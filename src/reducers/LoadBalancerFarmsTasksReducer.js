import { GET_LOADBALANCER_FARMS } from '../constants/LoadBalancerFarmsTasksConstants';

const initialState = {
    loadBalancerFarms: []
}

const LoadBalancerFarmsTasksReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_LOADBALANCER_FARMS:
            return Object.assign({}, state, { loadBalancerFarms: action.payload })
        default:
            return state;
    }
}

export default LoadBalancerFarmsTasksReducer;
