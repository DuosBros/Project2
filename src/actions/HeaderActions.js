import {SEARCH_SERVERS} from '../contants/HeaderConstants';

export function searchServersAction(payload) {
    return {
        payload,
        type: SEARCH_SERVERS
    }
}