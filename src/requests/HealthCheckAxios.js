import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function getHealthChecks() {
    return axios.get(LOCO_API + 'healthcheck');
}