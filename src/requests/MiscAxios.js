import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function getServiceVirtualMachines() {
    return axios.get(LOCO_API + 'servicevirtualmachine');
}

export function getExcelFile(fileName, type, data) {
    return axios.post(LOCO_API + 'export/?filename=' + fileName + '&type=' + type, data, { withCredentials: true })
}