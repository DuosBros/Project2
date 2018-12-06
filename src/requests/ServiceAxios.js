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