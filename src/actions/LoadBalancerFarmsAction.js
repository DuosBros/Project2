import { GET_LOADBALANCER_FARMS } from "../constants/LoadBalancerFarmsConstants";

export function getAllLoadBalancerFarmsAction(payload) {
    return {
        payload,
        type: GET_LOADBALANCER_FARMS
    }
}