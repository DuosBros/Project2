import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function getAllLoadBalancerFarms() {
    return axios.get(LOCO_API + 'lbfarm');
}
