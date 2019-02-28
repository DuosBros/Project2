import { GET_LOADBALANCER_FARMS, GET_LOADBALANCER_POOL_STATUS } from '../constants/LoadBalancerFarmsConstants';

const initialState = {
    loadBalancerFarms: { success: true }
}

const LoadBalancerFarmsTasksReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_LOADBALANCER_FARMS:
            return Object.assign({}, state, { loadBalancerFarms: action.payload })
        case GET_LOADBALANCER_POOL_STATUS:
            console.log(`in LoadBalancerFarmsTasksReducer`, { action });
            return Object.assign({}, state, { loadBalancerPoolStatus: { } })
        default:
            return state;
    }
}

export default LoadBalancerFarmsTasksReducer;
