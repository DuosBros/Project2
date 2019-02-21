import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function getLoadBalancers() {
    return axios.get(LOCO_API + 'Loadbalancer');
}

export function getLoadBalancersTokens() {
    return axios.get(LOCO_API + 'Loadbalancer/lbtoken');
}

export function deleteLoadBalancerToken(id) {
    return axios.delete(LOCO_API + 'Loadbalancer/lbtoken/' + id);
}