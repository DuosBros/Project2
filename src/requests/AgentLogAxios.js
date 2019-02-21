import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function getAgentLogs() {
    return axios.get(LOCO_API + 'Log');
}