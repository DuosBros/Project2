import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function authenticate() {
    return axios.get('http://localhost:24298/api/' + 'auth', { withCredentials: true });
}
