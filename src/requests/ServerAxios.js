import axios from 'axios';
import { LOCO_API, PM_API } from '../appConfig';

export function getServerDetails(serverId) {
    return axios.get(LOCO_API + 'server/' + serverId + '/full', { withCredentials: true });
}

export function getVmDetails(serverId) {
    return axios.get(LOCO_API + 'vm/search?serverId=' + serverId, { withCredentials: true })
}

export function getServerScomAlerts(serverName) {
    return axios.get(LOCO_API + 'scom/alert/search?computerName=' + serverName, { withCredentials: true })
}

export function getServers() {
    return axios.get(LOCO_API + 'server/');
}

export function getDiskUsageDetails(serverName) {
    // TODO    
    return axios.get(PM_API)
}