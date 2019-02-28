import { GET_LOADBALANCER_FARMS, GET_LOADBALANCER_POOL_STATUS } from "../constants/LoadBalancerFarmsConstants";

export function getAllLoadBalancerFarmsAction(payload) {
    return {
        payload,
        type: GET_LOADBALANCER_FARMS
    }
}

export function getLoadBalancerPoolStatusAction(payload) {
    return {
        payload,
        type: GET_LOADBALANCER_POOL_STATUS
    }
}
