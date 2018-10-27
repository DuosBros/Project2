import { SEARCH_SERVERS, SEARCH_SERVICE_SHORTCUTS, TOGGLE_VERTICAL_MENU, TOGGLE_USER_DETAILS } from '../contants/HeaderConstants';

const headerInitialState = {
    searchServerResult: [],
    searchServiceShortcutsResult: [],
    showVerticalMenu: true,
    showUserDetails: false
}

const HeaderReducer = (state = headerInitialState, action) => {
    switch (action.type) {
        case SEARCH_SERVERS:
            return Object.assign({}, state, { searchServerResult: action.payload })
        case SEARCH_SERVICE_SHORTCUTS:
            return Object.assign({}, state, { searchServiceShortcutsResult: action.payload })
        case TOGGLE_VERTICAL_MENU:
            return Object.assign({}, state, { showVerticalMenu: !state.showVerticalMenu })
        case TOGGLE_USER_DETAILS:
            return Object.assign({}, state, { showUserDetails: !state.showUserDetails })
        default:
            return state;
    }
}

export default HeaderReducer;