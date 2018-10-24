import {SEARCH_SERVERS, SEARCH_SERVICE_SHORTCUTS, TOGGLE_VERTICAL_MENU} from '../contants/HeaderConstants';

export function searchServersAction(payload) {
    return {
        payload,
        type: SEARCH_SERVERS
    }
}

export function searchServiceShortcutAction(payload) {
    return {
        payload,
        type: SEARCH_SERVICE_SHORTCUTS
    }
}

export function toggleVerticalMenuAction() {
    return {
        type: TOGGLE_VERTICAL_MENU
    }
}