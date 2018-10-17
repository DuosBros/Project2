import axios from 'axios';
import {LOCO_API} from '../appConfig';

export function searchServers(query) {
    return axios.get(LOCO_API + 'Search/Server/' + encodeURIComponent(query));
}

export function searchServiceShortcut(query) {
    return axios.get(LOCO_API + 'Search/ServiceShortcut/' + encodeURIComponent(query));
}
