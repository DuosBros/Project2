import { GET_IPADDRESSES } from '../constants/IPAddressConstants';

export function getIPAddressesAction(payload) {
    return {
        payload,
        type: GET_IPADDRESSES
    }
}