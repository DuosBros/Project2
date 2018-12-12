import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function getIPAddresses() {
    return axios.get(LOCO_API + 'ip');
}