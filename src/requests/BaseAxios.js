import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function authenticate() {
    return axios.get(LOCO_API + 'auth', { withCredentials: true });
}
