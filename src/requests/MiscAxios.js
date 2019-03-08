import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function getServiceVirtualMachines() {
    return axios.get(LOCO_API + 'servicevirtualmachine');
}
