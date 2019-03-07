import {
    GET_LOADBALANCER_FARMS,
    SET_LOADBALANCER_POOL_STATUS,
    SET_LOADBALANCER_POOL_STATUS_LOADING } from '../utils/constants';

const initialState = {
    loadBalancerFarms: { success: true },
    loadBalancerPoolStatus: {}
}

const LoadBalancerFarmsTasksReducer = (state = initialState, action) => {
    var lbId, pool, lbs, pools, response, loading;

    switch (action.type) {
        case GET_LOADBALANCER_FARMS:
            return Object.assign({}, state, { loadBalancerFarms: action.payload })
        case SET_LOADBALANCER_POOL_STATUS:
            //console.log(`in LoadBalancerFarmsTasksReducer: SET_LOADBALANCER_POOL_STATUS`, { action });
            lbId = action.payload.lbId;
            pool = action.payload.pool;
            response = action.payload.response;

            lbs = Object.assign({}, state.loadBalancerPoolStatus);
            pools = lbs[lbId] = Object.assign({}, lbs[lbId]);
            pools[pool] = response;

            return Object.assign({}, state, { loadBalancerPoolStatus: lbs })
        case SET_LOADBALANCER_POOL_STATUS_LOADING:
            //console.log(`in LoadBalancerFarmsTasksReducer: SET_LOADBALANCER_POOL_STATUS_LOADING`, { action });
            lbId = action.payload.lbId;
            pool = action.payload.pool;
            loading = action.payload.loading;

            lbs = Object.assign({}, state.loadBalancerPoolStatus);
            pools = lbs[lbId] = Object.assign({}, lbs[lbId]);
            pools[pool] = Object.assign({}, pools[pool], { loading })

            return Object.assign({}, state, { loadBalancerPoolStatus: lbs })
        default:
            return state;
    }
}

export default LoadBalancerFarmsTasksReducer;
