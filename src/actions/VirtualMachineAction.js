import { GET_VIRTUALMACHINES } from '../constants/VirtualMachineConstants';

export function getVirtualMachinesAction(payload) {
    return {
        payload,
        type: GET_VIRTUALMACHINES
    }
}