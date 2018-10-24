import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function sendAuthenticationData(payload) {
    return axios.post(LOCO_API + 'auth', payload);
}