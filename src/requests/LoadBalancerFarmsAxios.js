import axios from 'axios';
import { LOCO_API } from '../appConfig';
import { axiosHandler } from '../utils/HelperFunction';

export function getAllLoadBalancerFarms() {
    return axios.get(LOCO_API + 'lbfarm');
}

export function saveLoadBalancerFarmsChanges(serviceId, lbFarmsIds, loadBalancerId) {
    return axios.post(LOCO_API + 'service/' + serviceId + "/lbfarm?lbFarmsIds=" + lbFarmsIds + "&loadBalancerId=" + loadBalancerId, null, { withCredentials: true })
}

export function getLoadBalancerPoolStatus(loadBalancerId, poolName) {
    return axiosHandler(axios.get(LOCO_API + '../lbapi/' + loadBalancerId + '/pool/' + poolName))
        .then(function (response) {
            const data = response.data;
            if (Array.isArray(data) && data.length === 1 && data[0].Status === null) {
                return Object.assign({}, response, { success: false, error: data[0].Ip });
            }
            return response;
        });
}
