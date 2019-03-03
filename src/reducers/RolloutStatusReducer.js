import {
    GET_DISME_APPLICATIONS, REMOVE_ROLLOUT_STATUS,
    GET_ROLLOUT_STATUS, DELETE_ALL_ROLLOUT_STATUSES
} from '../constants/RolloutStatusConstants';
import { GET_HEALTHS } from '../constants/ServiceConstants';
import { GET_VERSIONS } from '../constants/VersionStatusConstants';

const initialState = {
    dismeApplications: { success: true, data: [] },
    rolloutStatuses: []
}

const RolloutStatusReducer = (state = initialState, action) => {
    var copy, index, mappedRolloutStatuses;

    switch (action.type) {
        case GET_DISME_APPLICATIONS:
            return Object.assign({}, state, { dismeApplications: action.payload })
        case REMOVE_ROLLOUT_STATUS:
            return Object.assign({}, state, {
                rolloutStatuses: state.rolloutStatuses.filter(x => {
                    return x.serviceName !== action.payload.Shortcut
                })
            })
        // this doesn't have standard error handling
        case GET_ROLLOUT_STATUS:
            var isAlreadyThere = false;
            mappedRolloutStatuses = state.rolloutStatuses.map(x => {
                if (x.serviceName === action.payload.serviceName) {
                    x.rolloutStatus = action.payload.rolloutStatus;
                    x.isLoading = action.payload.isLoading;
                    x.err = action.payload.err;
                    x.health = action.payload.health;
                    x.version = action.payload.version
                    isAlreadyThere = true
                }

                return x;
            })

            if (!isAlreadyThere) {
                mappedRolloutStatuses.push(action.payload)
            }

            copy = Object.assign([], state, {
                rolloutStatuses: mappedRolloutStatuses
            })
            return copy;
        case DELETE_ALL_ROLLOUT_STATUSES:
            return Object.assign({}, state, { rolloutStatuses: [] })
        case GET_HEALTHS:
            copy = Object.assign([], state.rolloutStatuses);
            index = copy.findIndex(x => x.serviceId === action.payload.serviceId);

            if (index < 0) {
                throw new Error("Could not find");
            }

            if (Array.isArray(copy[index].rolloutStatus)) {
                mappedRolloutStatuses = copy[index].rolloutStatus.map(x => {
                    if (action.payload.success && action.payload.data) {
                        var serverHealth = action.payload.data.filter(y => y[2] === x.Ip)
                        if (serverHealth !== null) {
                            x.healthInfo = serverHealth[0];
                        }
                    }
                    else {
                        x.healthInfo = {}
                        x.healthInfo.err = action.payload.error
                    }

                    return x;
                })
            }

            copy[index].rolloutStatus = mappedRolloutStatuses

            return Object.assign({}, state, { rolloutStatuses: copy })
        case GET_VERSIONS:
            copy = Object.assign([], state.rolloutStatuses);
            index = copy.findIndex(x => x.serviceId === action.payload.serviceId);

            if (index < 0) {
                throw new Error("Could not find");
            }

            if (Array.isArray(copy[index].rolloutStatus)) {
                mappedRolloutStatuses = copy[index].rolloutStatus.map(x => {
                    if (action.payload.success && action.payload.data) {
                        var versionObject = action.payload.data.filter(y => y.ServerName === x.Server)
                        if (versionObject !== null) {
                            x.versionInfo = versionObject[0].Version;
                        }
                    }
                    else {
                        if (action.payload.error) {
                            x.versionInfo = {}
                            x.versionInfo.err = action.payload.error
                        }
                    }
                    return x;
                })
            }

            copy[index].rolloutStatus = mappedRolloutStatuses
            return Object.assign({}, state, { rolloutStatuses: copy })
        default:
            return state;
    }
}

export default RolloutStatusReducer;
