import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function getPatchGroups() {
    return axios.get(LOCO_API + 'patchgroups');
}

export function getPatchGroupDetails(id) {
    return axios.get(LOCO_API + 'patchgroups/' + id);
}

export function getPatchGroupServers(id) {
    return axios.get(LOCO_API + 'patchgroups/' + id + '/servers');
}