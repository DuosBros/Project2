import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function getServerDetails(serverId) {
    return axios.get(LOCO_API + 'server/' + serverId + '/full', {withCredentials: true});
}

export function getVmDetails(serverId) {
    return axios.get(LOCO_API + 'vm/search?serverId=' + serverId, {withCredentials: true})
}

export function getServerScomAlerts(serverName) {
    return axios.get(LOCO_API + 'scom/alert/search?computerName=' + serverName, {withCredentials: true})
}