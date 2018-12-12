import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function getAllLoadBalancerFarms() {
    return axios.get(LOCO_API + 'lbfarm');
}

export function saveLoadBalancerFarmsChanges(serviceId, lbFarmsIds, loadBalancerId) {
    return axios.post(LOCO_API + 'service/'+ serviceId + "/lbfarm?lbFarmsIds=" + lbFarmsIds + "&loadBalancerId=" + loadBalancerId)
}