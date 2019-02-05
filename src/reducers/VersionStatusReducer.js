import { GET_STAGES, GET_VERSIONS } from '../constants/VersionStatusConstants';

const serverInitialState = {
    stages: { success: true, data: [] },
    versions: { success: true }
}

const VersionStatusReducer = (state = serverInitialState, action) => {
    switch (action.type) {
        case GET_STAGES:
            return Object.assign({}, state, { stages: action.payload })
        case GET_VERSIONS:
            return Object.assign({}, state, { versions: action.payload })
        default:
            return state;
    }
}

export default VersionStatusReducer;