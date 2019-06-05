import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function getStages() {
    return axios.get(LOCO_API + 'stage');
}

export function getVersions(payload) {
    return axios.post(LOCO_API + 'Service/version/name', payload)
}

export function getVersionsByServiceId(serviceId, servers) {
    return axios.post(LOCO_API + 'Service/' + serviceId + '/version', servers)
}