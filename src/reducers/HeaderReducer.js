import { SEARCH_SERVERS, SEARCH_SERVICE_SHORTCUTS, TOGGLE_VERTICAL_MENU } from '../contants/HeaderConstants';

const headerInitialState = {
    searchServerResult: [],
    searchServiceShortcutsResult: [],
    showVerticalMenu: true
}

const HeaderReducer = (state = headerInitialState, action) => {
    switch (action.type) {
        case SEARCH_SERVERS:
            return Object.assign({}, state, { searchServerResult: action.payload })
        case SEARCH_SERVICE_SHORTCUTS:
            return Object.assign({}, state, { searchServiceShortcutsResult: action.payload })
        case TOGGLE_VERTICAL_MENU:
            return Object.assign({}, state, { showVerticalMenu: !state.showVerticalMenu })
        default:
            return state;
    }
}

export default HeaderReducer;