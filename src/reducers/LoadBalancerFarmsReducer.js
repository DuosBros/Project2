import { GET_LOADBALANCER_FARMS } from '../constants/LoadBalancerFarmsConstants';

const initialState = {
    loadBalancerFarms: { success: true }
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
