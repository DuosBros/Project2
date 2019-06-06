import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function getHealthChecks() {
    return axios.get(LOCO_API + 'healthcheck');
}

export function getHealths(serviceId, ipsPayload) {
    return axios.post(LOCO_API + 'service/' + serviceId + '/health', ipsPayload)
}

export function getHealthCheckContent(url, ip, host) {
    return axios.get(LOCO_API + 'healthcheck/content?url=' + url + "&ip=" + ip + "&host=" + host)
}