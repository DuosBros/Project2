import { SEARCH_SERVERS } from '../contants/HeaderConstants';

const headerInitialState = {
    searchServerResult: []
}

const HeaderReducer = (state = headerInitialState, action) => {
    switch (action.type) {
        case SEARCH_SERVERS:
            return Object.assign({}, state, { searchServerResult: action.payload })
        default:
            return state;
    }
}

export default HeaderReducer;