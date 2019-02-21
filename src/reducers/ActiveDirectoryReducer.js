import { GET_ACTIVEDIRECTORIES, CREATE_ACTIVEDIRECTORY, EDIT_ACTIVEDIRECTORY, DELETE_ACTIVEDIRECTORY } from '../constants/ActiveDirectoryConstants';

const initialState = {
    activeDirectories: { success: true }
}

const ActiveDirectoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ACTIVEDIRECTORIES:
            return Object.assign({}, state, { activeDirectories: action.payload })
        case CREATE_ACTIVEDIRECTORY:
            return Object.assign({}, state, { activeDirectories: action.payload })
        case EDIT_ACTIVEDIRECTORY:
            return Object.assign({}, state, { activeDirectories: action.payload })
        case DELETE_ACTIVEDIRECTORY:
            return Object.assign({}, state, { activeDirectories: action.payload })
        default:
            return state;
    }
}

export default ActiveDirectoryReducer;
