import { GET_AGENTLOGS } from '../constants/AgentLogConstants';

export function getAgentLogsAction(payload) {
    return {
        payload,
        type: GET_AGENTLOGS
    }
}