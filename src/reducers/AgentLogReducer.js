import { GET_AGENTLOGS } from '../constants/AgentLogConstants';
import moment from 'moment';

const initialState = {
    agentLogs: { success: true }
}

const AgentLogReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_AGENTLOGS:
            if(action.payload.data && action.payload.success) {
                action.payload.data.forEach(x => {
                    x.LastRun = x.LastRun ? moment(x.LastRun).local().format("HH:mm:ss DD.MM.YYYY") : null
                    x.StartTimeUTC = x.StartTimeUTC ? moment(x.StartTimeUTC).local().format("HH:mm:ss DD.MM.YYYY") : null
                    x.EndTimeUTC = x.EndTimeUTC ? moment(x.EndTimeUTC).local().format("HH:mm:ss DD.MM.YYYY") : null
                    x.Success = x.Success ? "true" : "false"
                })
            }
            return Object.assign({}, state, { agentLogs: action.payload })
        default:
            return state;
    }
}

export default AgentLogReducer;
