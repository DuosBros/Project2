import axios from 'axios';
import { LOCO_API } from '../appConfig';
import { getLoadBalancerPoolStatusAction } from '../actions/LoadBalancerFarmsAction';

export function getAllLoadBalancerFarms() {
    return axios.get(LOCO_API + 'lbfarm');
}

export function saveLoadBalancerFarmsChanges(serviceId, lbFarmsIds, loadBalancerId) {
    return axios.post(LOCO_API + 'service/'+ serviceId + "/lbfarm?lbFarmsIds=" + lbFarmsIds + "&loadBalancerId=" + loadBalancerId)
}

export function getLoadBalancerPoolStatus(loadBalancerId, poolName) {
    return axios.get(LOCO_API + 'lbapi/' + loadBalancerId + '/pool/' + poolName)
        .then(
            /*response => ({ loadBalancerId, poolName, response }),*/
            function(response) {
                console.log("in actios response handler:", arguments);
                return ({ loadBalancerId, poolName, success: true, data: response });
            },
            response => ({ loadBalancerId, poolName, success: true, data: response })
        )
        .then(getLoadBalancerPoolStatusAction);
}
