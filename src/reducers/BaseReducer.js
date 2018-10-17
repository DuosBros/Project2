import { AUTHENTICATE } from '../contants/BaseConstants';

const baseInitialState = {
    currentUser: {}
}

const BaseReducer = (state = baseInitialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return Object.assign({}, state, { currentUser: action.payload })
        default:
            return state;
    }
}

export default BaseReducer;