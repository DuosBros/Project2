import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function getServerDetails(serverId) {
    return axios.get(LOCO_API + 'server/' + serverId);
}
