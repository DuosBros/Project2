import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function getPatchGroups() {
    return axios.get(LOCO_API + 'patchgroups');
}