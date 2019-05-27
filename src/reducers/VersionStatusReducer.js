import { GET_STAGES, GET_VERSION, REMOVE_ALL_VERSIONS } from '../utils/constants';

const serverInitialState = {
    stages: { success: true, data: [] },
    versions: { success: true }
}

const VersionStatusReducer = (state = serverInitialState, action) => {
    switch (action.type) {
        case GET_STAGES:
            if(action.payload.data && action.payload.success) {
                let index = action.payload.data.findIndex(x => x.text === "Development")
                if(index >= 0) {
                    action.payload.data[index].text = "Dev"
                    action.payload.data[index].value = "Dev"
                }
            }
            return Object.assign({}, state, { stages: action.payload })
        case GET_VERSION:
            return Object.assign({}, state, { versions: action.payload })
        case REMOVE_ALL_VERSIONS:
            return Object.assign({}, state, { versions: { success: true, data: [] } })
        default:
            return state;
    }
}

export default VersionStatusReducer;