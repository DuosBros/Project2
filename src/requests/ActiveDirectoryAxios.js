import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function getActiveDirectories() {
    return axios.get(LOCO_API + 'activedirectory');
}

export function createActiveDirectory(payload) {
    return axios.post(LOCO_API + 'activedirectory', payload);
}

export function editActiveDirectories(ad) {
    return axios.put(LOCO_API + 'activedirectory', ad);
}

export function deleteActiveDirectory(id) {
    return axios.delete(LOCO_API + 'activedirectory/' + id);
}