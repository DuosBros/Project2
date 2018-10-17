import { SEARCH_SERVERS, SEARCH_SERVICE_SHORTCUTS } from '../contants/HeaderConstants';

const headerInitialState = {
    searchServerResult: [],
    searchServiceShortcutsResult: []
}

const HeaderReducer = (state = headerInitialState, action) => {
    switch (action.type) {
        case SEARCH_SERVERS:
            return Object.assign({}, state, { searchServerResult: action.payload })
        case SEARCH_SERVICE_SHORTCUTS:
            return Object.assign({}, state, { searchServiceShortcutsResult: action.payload })
        default:
            return state;
    }
}

export default HeaderReducer;