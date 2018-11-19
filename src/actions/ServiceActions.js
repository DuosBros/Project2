import {GET_SERVICE_DETAILS, TOGGLE_LOADBALANCERFARMS_TASKS} from '../contants/ServiceConstatnts';

export function getServiceDetailsAction(payload) {
    return {
        payload,
        type: GET_SERVICE_DETAILS
    }
}

export function toggleLoadBalancerFarmsTasksModalAction() {
    return {
        type: TOGGLE_LOADBALANCERFARMS_TASKS
    }
}