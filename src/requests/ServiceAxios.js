import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function getServiceDetails(serviceId) {
    return axios.get(LOCO_API + 'service/' + serviceId + '/full');
}

export function getDismeApplications() {
    return axios.get(LOCO_API + 'service/byapplication')
}

export function getServiceByShortcut(shortcuts) {
    return axios.post(LOCO_API + 'service/full', "\"" + shortcuts + "\"");
}

export function getServices() {
    return axios.get(LOCO_API + 'service');
}

export function getHealth(serviceId, IP) {
    return axios.get(LOCO_API + 'service/' + serviceId + '/ip/' + IP + '/health')
}

export function getVersion(serviceId, serverId) {
    return axios.get(LOCO_API + 'service/' + serviceId + '/server/' + serverId + '/version')
}