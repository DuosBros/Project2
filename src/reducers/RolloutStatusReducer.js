import {
    GET_DISME_APPLICATIONS, GET_SERVICE_DETAILS_BY_SHORTCUTS, REMOVE_SERVICE_DETAILS,
    GET_ROLLOUT_STATUS, DELETE_ALL_ROLLOUT_STATUSES, DELETE_ROLLOUT_STATUS
} from '../constants/RolloutStatusConstants';

import _ from 'lodash';

const initialState = {
    dismeApplications: [],
    serviceDetails: [],
    rolloutStatuses: []
}

const RolloutStatusReducer = (state = initialState, action) => {
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

            // if (action.payload.serviceName === "promo") {
            //     action.payload.rolloutStatus = [
            //         {
            //             "Lbid": 1,
            //             "LbName": "ixi3-lb1-1.is.icepor.com",
            //             "Pool": "EXT.promo.bwin.com",
            //             "RGroup": "1",
            //             "Name": null,
            //             "Ip": "10.130.129.143",
            //             "Port": 80,
            //             "Availability": "available",
            //             "Enabled": "enabled",
            //             "Description": "Pool member is available",
            //             "Status": "text-success",
            //             "Server": "ATVP1WWPRO101",
            //             "Serverid": 10064,
            //             "PatchGroup": "AT.PROD.A"
            //         },
            //         {
            //             "Lbid": 1,
            //             "LbName": "ixi3-lb1-1.is.icepor.com",
            //             "Pool": "EXT.promo.bwin.com",
            //             "RGroup": "2",
            //             "Name": null,
            //             "Ip": "10.130.129.144",
            //             "Port": 80,
            //             "Availability": "available",
            //             "Enabled": "enabled",
            //             "Description": "Pool member is available",
            //             "Status": "text-success",
            //             "Server": "ATVP1WWPRO102",
            //             "Serverid": 10067,
            //             "PatchGroup": "AT.PROD.B"
            //         },
            //         {
            //             "Lbid": 1,
            //             "LbName": "ixi3-lb1-1.is.icepor.com",
            //             "Pool": "INT.promo.bwin.com",
            //             "RGroup": "11",
            //             "Name": null,
            //             "Ip": "10.130.129.143",
            //             "Port": 80,
            //             "Availability": "available",
            //             "Enabled": "enabled",
            //             "Description": "Pool member is available",
            //             "Status": "text-success",
            //             "Server": "ATVP1WWPRO101",
            //             "Serverid": 10064,
            //             "PatchGroup": "AT.PROD.A"
            //         },
            //         {
            //             "Lbid": 1,
            //             "LbName": "ixi3-lb1-1.is.icepor.com",
            //             "Pool": "INT.promo.bwin.com",
            //             "RGroup": "12",
            //             "Name": null,
            //             "Ip": "10.130.129.144",
            //             "Port": 80,
            //             "Availability": "available",
            //             "Enabled": "enabled",
            //             "Description": "Pool member is available",
            //             "Status": "text-success",
            //             "Server": "ATVP1WWPRO102",
            //             "Serverid": 10067,
            //             "PatchGroup": "AT.PROD.B"
            //         },
            //         {
            //             "Lbid": 2,
            //             "LbName": "tsi-lb1-1.is.icepor.com",
            //             "Pool": "EXT.promo.bwin.com",
            //             "RGroup": "1",
            //             "Name": null,
            //             "Ip": "10.140.129.143",
            //             "Port": 80,
            //             "Availability": "available",
            //             "Enabled": "enabled",
            //             "Description": "Pool member is available",
            //             "Status": "text-success",
            //             "Server": "ATVP1WWPRO201",
            //             "Serverid": 10066,
            //             "PatchGroup": "AT.PROD.A"
            //         },
            //         {
            //             "Lbid": 2,
            //             "LbName": "tsi-lb1-1.is.icepor.com",
            //             "Pool": "EXT.promo.bwin.com",
            //             "RGroup": "2",
            //             "Name": null,
            //             "Ip": "10.140.129.144",
            //             "Port": 80,
            //             "Availability": "available",
            //             "Enabled": "enabled",
            //             "Description": "Pool member is available",
            //             "Status": "text-success",
            //             "Server": "ATVP1WWPRO202",
            //             "Serverid": 10071,
            //             "PatchGroup": "AT.PROD.B"
            //         },
            //         {
            //             "Lbid": 2,
            //             "LbName": "tsi-lb1-1.is.icepor.com",
            //             "Pool": "INT.promo.bwin.com",
            //             "RGroup": "11",
            //             "Name": null,
            //             "Ip": "10.140.129.143",
            //             "Port": 80,
            //             "Availability": "available",
            //             "Enabled": "enabled",
            //             "Description": "Pool member is available",
            //             "Status": "text-success",
            //             "Server": "ATVP1WWPRO201",
            //             "Serverid": 10066,
            //             "PatchGroup": "AT.PROD.A"
            //         },
            //         {
            //             "Lbid": 2,
            //             "LbName": "tsi-lb1-1.is.icepor.com",
            //             "Pool": "INT.promo.bwin.com",
            //             "RGroup": "12",
            //             "Name": null,
            //             "Ip": "10.140.129.144",
            //             "Port": 80,
            //             "Availability": "available",
            //             "Enabled": "enabled",
            //             "Description": "Pool member is available",
            //             "Status": "text-success",
            //             "Server": "ATVP1WWPRO202",
            //             "Serverid": 10071,
            //             "PatchGroup": "AT.PROD.B"
            //         }
            //     ]
            // }

            var isAlreadyThere = false;
            var mappedRolloutStatuses = state.rolloutStatuses.map(x => {
                if (x.serviceName === action.payload.serviceName) {
                    x.rolloutStatus = action.payload.rolloutStatus;
                    x.isLoading = action.payload.isLoading;
                    x.err = action.payload.err
                    isAlreadyThere = true
                }

                return x;
            })

            if (!isAlreadyThere) {
                mappedRolloutStatuses.push(action.payload)
            }

            var copy = Object.assign([], state, {
                rolloutStatuses: mappedRolloutStatuses
            })
            return copy;
        case DELETE_ALL_ROLLOUT_STATUSES:
            return Object.assign({}, state, { rolloutStatuses: [] })
        // case DELETE_ROLLOUT_STATUS:
        //     return Object.assign({}, state, { rolloutStatuses: state.rolloutStatuses.filter(x => x.serviceName !== action.payload) })
        default:
            return state;
    }
}

export default RolloutStatusReducer;
