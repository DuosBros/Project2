import axios from 'axios';
import { LOCO_API, PM_API } from '../appConfig';

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

export function getVersionsForRollout(serviceId, serverIdsPayload) {
    return axios.post(LOCO_API + 'service/' + serviceId + '/version', serverIdsPayload)
}

export function getHighAvailabilities() {
    return axios.get(LOCO_API + 'highavailability')
}

export function getServiceDeploymentStats(serviceShortcut, count) {
    return axios.get(PM_API + 'deploymentStats/service/history/' + serviceShortcut + '/' + count)
}

export function getServiceServers(serviceShortcut) {
    return axios.get(LOCO_API + 'service/name/' + serviceShortcut + '/server')
}