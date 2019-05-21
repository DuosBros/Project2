import { GET_ACTIVEDIRECTORIES, CREATE_ACTIVEDIRECTORY, EDIT_ACTIVEDIRECTORY, DELETE_ACTIVEDIRECTORY, GET_AGENTLOGS, AUTHENTICATE, AUTHENTICATION_STARTED, AUTHENTICATION_ENDED, AUTHENTICATION_OK, AUTHENTICATION_FAIL, TOGGLE_NOT_AUTHORIZED_MODAL, SEARCH_SERVERS, SEARCH_SERVICE_SHORTCUTS, TOGGLE_VERTICAL_MENU, TOGGLE_USER_DETAILS, GET_HEALTHCHECKS, GET_IPADDRESSES, GET_LOADBALANCERS, GET_LOADBALANCERS_TOKENS, DELETE_LOADBALANCER_TOKEN, GET_LOADBALANCER_FARMS, SET_LOADBALANCER_POOL_STATUS, SET_LOADBALANCER_POOL_STATUS_LOADING, GET_ENVIRONMENTS, GET_PATCHGROUPS, GET_PATCHGROUP_DETAILS, GET_PATCHGROUP_SERVERS, GET_DISME_APPLICATIONS, GET_ROLLOUT_STATUS, DELETE_ALL_ROLLOUT_STATUSES, REMOVE_ROLLOUT_STATUS, GET_SERVER_STATS, GET_SERVER_DETAILS, GET_VM_DETAILS, GET_SERVER_SCOM_ALERTS, GET_SERVERS, REMOVE_ALL_SERVICE_DETAILS, GET_SERVICE_DETAILS_BY_SHORTCUTS, REMOVE_SERVICE_DETAILS, GET_SERVICE_DETAILS, TOGGLE_LOADBALANCERFARMS_TASKS, GET_SERVICES, GET_HEALTHS, GET_VERSIONS, GET_HIGHAVAILABILITIES, GET_STAGES, GET_VERSION, REMOVE_ALL_VERSIONS, GET_VIRTUALMACHINES, GET_SERVICE_VIRTUALMACHINES, GET_SERVER_DEPLOYMENTS, GET_SERVICE_DEPLOYMENTS, SHOW_GENERIC_MODAL, CLOSE_GENERIC_MODAL, DELETE_SERVER, GET_DEFAULT_LTM_CONFIG, FETCH_LTM_JSON } from './constants';

export function fetchLTMJsonAction(payload) {
    return {
        payload,
        type: FETCH_LTM_JSON
    }
}

export function getDefaultLTMConfigAction(payload) {
    return {
        payload,
        type: GET_DEFAULT_LTM_CONFIG
    }
}
export function deleteServerAction(payload) {
    return {
        payload,
        type: DELETE_SERVER
    }
}

export function getActiveDirectoriesAction(payload) {
    return {
        payload,
        type: GET_ACTIVEDIRECTORIES
    }
}

export function createActiveDirectoryAction(payload) {
    return {
        payload,
        type: CREATE_ACTIVEDIRECTORY
    }
}

export function editActiveDirectoryAction(payload) {
    return {
        payload,
        type: EDIT_ACTIVEDIRECTORY
    }
}

export function deleteActiveDirectoryAction(payload) {
    return {
        payload,
        type: DELETE_ACTIVEDIRECTORY
    }
}

export function getAgentLogsAction(payload) {
    return {
        payload,
        type: GET_AGENTLOGS
    }
}


export function authenticateAction(payload) {
    return {
        payload,
        type: AUTHENTICATE
    }
}

export function authenticationStartedAction() {
    return {
        type: AUTHENTICATION_STARTED
    }
}

export function authenticateEndedAction() {
    return {
        type: AUTHENTICATION_ENDED
    }
}

export function authenticateOKAction() {
    return {
        type: AUTHENTICATION_OK
    }
}

export function authenticationFailedAction() {
    return {
        type: AUTHENTICATION_FAIL
    }
}

export function toggleNotAuthorizedModalAction() {
    return {
        type: TOGGLE_NOT_AUTHORIZED_MODAL
    }
}


export function searchServersAction(payload) {
    return {
        payload,
        type: SEARCH_SERVERS
    }
}

export function searchServiceShortcutAction(payload) {
    return {
        payload,
        type: SEARCH_SERVICE_SHORTCUTS
    }
}

export function toggleVerticalMenuAction() {
    return {
        type: TOGGLE_VERTICAL_MENU
    }
}

export function toggleUserDetailsAction() {
    return {
        type: TOGGLE_USER_DETAILS
    }
}

export function getHealthChecksAction(payload) {
    return {
        payload,
        type: GET_HEALTHCHECKS
    }
}

export function getIPAddressesAction(payload) {
    return {
        payload,
        type: GET_IPADDRESSES
    }
}


export function getLoadBalancersAction(payload) {
    return {
        payload,
        type: GET_LOADBALANCERS
    }
}

export function getLoadBalancersTokensAction(payload) {
    return {
        payload,
        type: GET_LOADBALANCERS_TOKENS
    }
}

export function deleteLoadBalancerTokenAction(payload) {
    return {
        payload,
        type: DELETE_LOADBALANCER_TOKEN
    }
}


export function getAllLoadBalancerFarmsAction(payload) {
    return {
        payload,
        type: GET_LOADBALANCER_FARMS
    }
}

export function setLoadBalancerPoolStatusAction(lbId, pool, response) {
    return {
        payload: { lbId, pool, response },
        type: SET_LOADBALANCER_POOL_STATUS
    }
}

export function setLoadBalancerPoolStatusLoadingAction(lbId, pool, loading) {
    return {
        payload: { lbId, pool, loading },
        type: SET_LOADBALANCER_POOL_STATUS_LOADING
    }
}

export function getEnvironmentsAction(payload) {
    return {
        payload,
        type: GET_ENVIRONMENTS
    }
}


export function getPatchGroupsAction(payload) {
    return {
        payload,
        type: GET_PATCHGROUPS
    }
}

export function getPatchGroupDetailsAction(payload) {
    return {
        payload,
        type: GET_PATCHGROUP_DETAILS
    }
}

export function getPatchGroupServersAction(payload) {
    return {
        payload,
        type: GET_PATCHGROUP_SERVERS
    }
}


export function getDismeApplicationsAction(payload) {
    return {
        payload,
        type: GET_DISME_APPLICATIONS
    }
}

export function getRolloutStatusAction(payload) {
    return {
        payload,
        type: GET_ROLLOUT_STATUS
    }
}

export function deleteAllRoloutStatusesAction() {
    return {
        type: DELETE_ALL_ROLLOUT_STATUSES
    }
}

export function removeRolloutStatusAction(payload) {
    return {
        payload,
        type: REMOVE_ROLLOUT_STATUS
    }
}


export function getServerStatsAction(payload) {
    return {
        payload,
        type: GET_SERVER_STATS
    }
}

export function getServerDetailsAction(payload) {
    return {
        payload,
        type: GET_SERVER_DETAILS
    }
}

export function getVmDetailsAction(payload) {
    return {
        payload,
        type: GET_VM_DETAILS
    }
}

export function getServerScomAlertsAction(payload) {
    return {
        payload,
        type: GET_SERVER_SCOM_ALERTS
    }
}

export function getServersAction(payload) {
    return {
        payload,
        type: GET_SERVERS
    }
}


export function removeAllServiceDetailsAction() {
    return {
        type: REMOVE_ALL_SERVICE_DETAILS
    }
}

export function getServiceDetailsByShortcutsAction(payload) {
    return {
        payload,
        type: GET_SERVICE_DETAILS_BY_SHORTCUTS
    }
}

export function removeServiceDetailsAction(payload) {
    return {
        payload,
        type: REMOVE_SERVICE_DETAILS
    }
}

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

export function getServicesAction(payload) {
    return {
        payload,
        type: GET_SERVICES
    }
}

export function getHealthsAction(payload) {
    return {
        payload,
        type: GET_HEALTHS
    }
}

export function getVersionsAction(payload) {
    return {
        payload,
        type: GET_VERSIONS
    }
}

export function getHighAvailabilitiesAction(payload) {
    return {
        payload,
        type: GET_HIGHAVAILABILITIES
    }
}


export function getStagesAction(payload) {
    return {
        payload,
        type: GET_STAGES
    }
}

export function getVersionAction(payload) {
    return {
        payload,
        type: GET_VERSION
    }
}

export function removeAllVersionsAction() {
    return {
        type: REMOVE_ALL_VERSIONS
    }
}

export function getVirtualMachinesAction(payload) {
    return {
        payload,
        type: GET_VIRTUALMACHINES
    }
}

export function getServiceVirtualMachinesAction(payload) {
    return {
        payload,
        type: GET_SERVICE_VIRTUALMACHINES
    }
}

export function getServerDeploymentStatsAction(payload) {
    return {
        payload,
        type: GET_SERVER_DEPLOYMENTS
    }
}

export function getServiceDeploymentStatsAction(payload) {
    return {
        payload,
        type: GET_SERVICE_DEPLOYMENTS
    }
}

export function closeGenericModalAction() {
    return {
        type: CLOSE_GENERIC_MODAL
    }
}

export function showGenericModalAction(payload) {
    return {
        payload,
        type: SHOW_GENERIC_MODAL
    }
}