import axios from 'axios';
import { LOCO_API, PM_API, DEFAULT_TIME_FRAME, DEFAULT_INTERVAL } from '../appConfig';

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
    return axios.get(PM_API + 'serverStats/' + serverName + "/" + DEFAULT_TIME_FRAME + "/" + DEFAULT_INTERVAL)
}

export function getServerDeploymentStats(serverName, count) {
    return axios.get(PM_API + 'deploymentStats/server/history/' + serverName + "/" + count)
}

export function deleteServer(id) {
    return axios.delete(LOCO_API + 'server/' + id, { withCredentials: true });
}