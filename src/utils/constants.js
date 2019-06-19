export const GET_ACTIVEDIRECTORIES = 'GET_ACTIVEDIRECTORIES'
export const CREATE_ACTIVEDIRECTORY = 'CREATE_ACTIVEDIRECTORY'
export const EDIT_ACTIVEDIRECTORY = 'EDIT_ACTIVEDIRECTORY'
export const DELETE_ACTIVEDIRECTORY = 'DELETE_ACTIVEDIRECTORY'
export const GET_AGENTLOGS = 'GET_AGENTLOGS'
export const AUTHENTICATE = 'AUTHENTICATE'
export const AUTHENTICATION_STARTED = 'AUTHENTICATION_STARTED'
export const AUTHENTICATION_ENDED = 'AUTHENTICATION_ENDED'
export const AUTHENTICATION_OK = 'AUTHENTICATION_OK'
export const AUTHENTICATION_FAIL = 'AUTHENTICATION_FAIL'
export const TOGGLE_NOT_AUTHORIZED_MODAL = 'TOGGLE_NOT_AUTHORIZED_MODAL'
export const SEARCH_SERVERS = 'SEARCH_SERVERS'
export const SEARCH_SERVICE_SHORTCUTS = 'SEARCH_SERVICE_SHORTCUTS'
export const TOGGLE_VERTICAL_MENU = 'TOGGLE_VERTICAL_MENU'
export const TOGGLE_USER_DETAILS = 'TOGGLE_USER_DETAILS'
export const GET_HEALTHCHECKS = 'GET_HEALTHCHECKS'
export const GET_IPADDRESSES = 'GET_IPADDRESSES'
export const GET_LOADBALANCERS = 'GET_LOADBALANCERS'
export const GET_LOADBALANCERS_TOKENS = 'GET_LOADBALANCERS_TOKENS'
export const DELETE_LOADBALANCER_TOKEN = 'DELETE_LOADBALANCER_TOKEN'
export const GET_LOADBALANCER_FARMS = 'GET_LOADBALANCER_FARMS'
export const SET_LOADBALANCER_POOL_STATUS = 'SET_LOADBALANCER_POOL_STATUS'
export const SET_LOADBALANCER_POOL_STATUS_LOADING = 'SET_LOADBALANCER_POOL_STATUS_LOADING'
export const SEND_AUTHENTICATION_DATA = 'SEND_AUTHENTICATION_DATA'
export const GET_ENVIRONMENTS = 'GET_ENVIRONMENTS'
export const GET_PATCHGROUPS = 'GET_PATCHGROUPS'
export const GET_PATCHGROUP_DETAILS = 'GET_PATCHGROUP_DETAILS'
export const GET_PATCHGROUP_SERVERS = 'GET_PATCHGROUP_SERVERS'
export const GET_DISME_APPLICATIONS = 'GET_DISME_APPLICATIONS'
export const GET_ROLLOUT_STATUS = 'GET_ROLLOUT_STATUS'
export const DELETE_ALL_ROLLOUT_STATUSES = 'DELETE_ALL_ROLLOUT_STATUSES'
export const REMOVE_ROLLOUT_STATUS = 'REMOVE_ROLLOUT_STATUS'
export const GET_SERVER_DETAILS = 'GET_SERVER_DETAILS'
export const GET_VM_DETAILS = 'GET_VM_DETAILS'
export const GET_SERVER_SCOM_ALERTS = 'GET_SERVER_SCOM_ALERTS'
export const GET_SERVERS = 'GET_SERVERS'
export const GET_SERVER_STATS = 'GET_SERVER_STATS'
export const GET_SERVICE_DETAILS = 'GET_SERVICE_DETAILS'
export const TOGGLE_LOADBALANCERFARMS_TASKS = 'TOGGLE_LOADBALANCERFARMS_TASKS'
export const GET_SERVICES = 'GET_SERVICES'
export const GET_HEALTHS_ROLLOUTSTATUS = 'GET_HEALTHS_ROLLOUTSTATUS'
export const GET_SERVICE_DETAILS_BY_SHORTCUTS = 'GET_SERVICE_DETAILS_BY_SHORTCUTS'
export const REMOVE_SERVICE_DETAILS = 'REMOVE_SERVICE_DETAILS'
export const REMOVE_ALL_SERVICE_DETAILS = 'REMOVE_ALL_SERVICE_DETAILS'
export const GET_HIGHAVAILABILITIES = 'GET_HIGHAVAILABILITIES'
export const GET_STAGES = 'GET_STAGES'
export const GET_VERSION = 'GET_VERSION'
export const GET_VERSIONS_ROLLOUTSTATUS = 'GET_VERSIONS_ROLLOUTSTATUS'
export const REMOVE_ALL_VERSIONS = 'REMOVE_ALL_VERSIONS'
export const GET_VIRTUALMACHINES = 'GET_VIRTUALMACHINES'
export const GET_SERVICE_VIRTUALMACHINES = 'GET_SERVICE_VIRTUALMACHINES'
export const GET_SERVER_DEPLOYMENTS = 'GET_SERVER_DEPLOYMENTS'
export const GET_SERVICE_DEPLOYMENTS = 'GET_SERVICE_DEPLOYMENTS'
export const CLOSE_GENERIC_MODAL = 'CLOSE_GENERIC_MODAL'
export const SHOW_GENERIC_MODAL = 'SHOW_GENERIC_MODAL'
export const DELETE_SERVER = 'DELETE_SERVER'
export const GET_DEFAULT_LTM_CONFIG = 'GET_DEFAULT_LTM_CONFIG'
export const FETCH_LTM_JSON = 'FETCH_LTM_JSON'
export const FETCH_GTM_JSON = 'FETCH_GTM_JSON'
export const FETCH_NONPROD_GTM_JSON = 'FETCH_NONPROD_GTM_JSON'
export const GET_SERVICE_SERVERS = 'GET_SERVICE_SERVERS'
export const DELETE_SERVICE_SERVER = 'DELETE_SERVICE_SERVER'
export const GET_HEALTHS = 'GET_HEALTHS'

export const ROUTE_SERVERS = '/servers';
export const ROUTE_SERVERS_ADMIN = '/admin/servers';
export const ROUTE_SERVER_DETAILS = '/server/:id';
export const ROUTE_SERVER_STATISTICS = '/statistics/servers';

export const ROUTE_SERVICES = '/services';
export const ROUTE_SERVICE_DETAILS = '/service/:id';
export const ROUTE_SERVICES_STATISTICS = '/statistics/services';
export const ROUTE_SERVICE_VIRTUALMACHINES = '/statistics/servicevirtualmachines';

export const ROUTE_PATCHGROUPS = '/patchgroups';
export const ROUTE_PATCHGROUP_DETAILS = '/patchgroup/:id';

export const ROUTE_LBFARMS = '/lbfarms';
export const ROUTE_LBFARMS_STATISTICS = '/statistics/loadbalancerfarms';

export const ROUTE_ADMIN_LTMGTM = '/admin/ltm_gtm';

export const ROUTE_HEALTH = '/health'
export const ROUTE_HEALTHCHECKS = '/health/healthchecks';