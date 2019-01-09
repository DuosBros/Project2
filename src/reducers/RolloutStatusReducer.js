import {
    GET_DISME_APPLICATIONS, GET_SERVICE_DETAILS_BY_SHORTCUTS, REMOVE_SERVICE_DETAILS,
    GET_ROLLOUT_STATUS, DELETE_ALL_ROLLOUT_STATUSES
} from '../constants/RolloutStatusConstants';

import { GET_HEALTH, GET_VERSION } from '../constants/ServiceConstants';

const initialState = {
    dismeApplications: [],
    serviceDetails: [],
    rolloutStatuses: []
}

const RolloutStatusReducer = (state = initialState, action) => {
    var copy, index, mappedRolloutStatuses;

    switch (action.type) {
        case GET_DISME_APPLICATIONS:
            return Object.assign({}, state, { dismeApplications: action.payload })
        case GET_SERVICE_DETAILS_BY_SHORTCUTS:
            return Object.assign({}, state, { serviceDetails: action.payload })
        case REMOVE_SERVICE_DETAILS:
            return Object.assign({}, state, {
                serviceDetails: state.serviceDetails.filter(x => {
                    return x.Service[0].Shortcut !== action.payload.Shortcut
                }),
                rolloutStatuses: state.rolloutStatuses.filter(x => {
                    return x.serviceName !== action.payload.Shortcut
                })
            })
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
        // case DELETE_ROLLOUT_STATUS:
        //     return Object.assign({}, state, { rolloutStatuses: state.rolloutStatuses.filter(x => x.serviceName !== action.payload) })
        case GET_HEALTH:
            copy = Object.assign([], state.rolloutStatuses);

            index = copy.findIndex(x => x.serviceId === action.payload.serviceId);

            if (index < 0) {
                throw new Error("Could not find");
            }

            mappedRolloutStatuses = copy[index].rolloutStatus.map(x => {
                if (x.Ip === action.payload.ip) {
                    if(action.payload.refreshTriggered) {
                        if ('healthInfo' in x) {
                            delete x.healthInfo
                        }
                    }
                    else {
                        x.healthInfo = action.payload;
                    }
                }

                return x;
            })

            copy[index].rolloutStatus = mappedRolloutStatuses

            return Object.assign({}, state, { rolloutStatuses: copy })

        case GET_VERSION:
            copy = Object.assign([], state.rolloutStatuses);

            index = copy.findIndex(x => x.serviceId === action.payload.serviceId);

            if (index < 0) {
                throw new Error("Could not find")
            }

            mappedRolloutStatuses = copy[index].rolloutStatus.map(x => {
                if (x.Serverid === action.payload.serverId) {
                    if(action.payload.refreshTriggered) {
                        if ('versionInfo' in x) {
                            delete x.versionInfo
                        }
                    }
                    else {
                        x.versionInfo = action.payload;
                    }
                }

                return x;
            })

            copy[index].rolloutStatus = mappedRolloutStatuses

            return Object.assign({}, state, { rolloutStatuses: copy })

        default:
            return state;
    }
}

export default RolloutStatusReducer;
