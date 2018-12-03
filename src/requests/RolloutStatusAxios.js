import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function getRolloutStatus(serviceName) {
    return axios.get(LOCO_API + 'lbapi/rollout/name?service=' + serviceName);
}