import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function getServerDetails(serverId) {
    return axios.get(LOCO_API + 'server/' + serverId + '/full');
}

export function getVmDetails(serverId) {
    return axios.get(LOCO_API + 'vm/search?serverId=' + serverId)
}
