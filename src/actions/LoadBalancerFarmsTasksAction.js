import { GET_LOADBALANCER_FARMS } from "../constants/LoadBalancerFarmsTasksConstants";

export function getAllLoadBalancerFarmsAction(payload) {
    return {
        payload,
        type: GET_LOADBALANCER_FARMS
    }
}