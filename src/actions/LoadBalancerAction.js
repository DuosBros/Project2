import { GET_LOADBALANCERS, GET_LOADBALANCERS_TOKENS, DELETE_LOADBALANCER_TOKEN } from '../constants/LoadBalancerConstants';

export function getLoadBalancersAction(payload) {
    return {
        payload,
        type: GET_LOADBALANCERS
    }
}

export function getLoadBalancersTokensAction(payload) {
    return {
        payload,
        type: GET_LOADBALANCERS_TOKENS
    }
}

export function deleteLoadBalancerTokenAction(payload) {
    return {
        payload,
        type: DELETE_LOADBALANCER_TOKEN
    }
}