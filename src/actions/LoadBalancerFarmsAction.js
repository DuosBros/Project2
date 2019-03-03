import {
    GET_LOADBALANCER_FARMS,
    SET_LOADBALANCER_POOL_STATUS,
    SET_LOADBALANCER_POOL_STATUS_LOADING
} from "../constants/LoadBalancerFarmsConstants";

export function getAllLoadBalancerFarmsAction(payload) {
    return {
        payload,
        type: GET_LOADBALANCER_FARMS
    }
}

export function setLoadBalancerPoolStatusAction(lbId, pool, response) {
    return {
        payload: { lbId, pool, response },
        type: SET_LOADBALANCER_POOL_STATUS
    }
}

export function setLoadBalancerPoolStatusLoadingAction(lbId, pool, loading) {
    return {
        payload: { lbId, pool, loading },
        type: SET_LOADBALANCER_POOL_STATUS_LOADING
    }
}
