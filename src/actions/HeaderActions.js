import {SEARCH_SERVERS, SEARCH_SERVICE_SHORTCUTS, TOGGLE_VERTICAL_MENU, TOGGLE_USER_DETAILS} from '../contants/HeaderConstants';

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

export function toggleUserDetailsAction() {
    return {
        type: TOGGLE_USER_DETAILS
    }
}