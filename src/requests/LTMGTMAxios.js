import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function getDefaultLTMConfig(team) {
    return axios.get(LOCO_API + 'lbapi/json/ltm/default?team=' + team);
}

export function fetchLTMJson(payload) {
    return axios.post(LOCO_API + 'lbapi/json/ltm', payload)
}

export function fetchGTMJson(payload) {
    return axios.post(LOCO_API + 'lbapi/json/gtm', payload)
}