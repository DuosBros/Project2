import axios from 'axios';
import { LOCO_API, PM_API } from '../appConfig';

export function getServiceVirtualMachines() {
    return axios.get(LOCO_API + 'servicevirtualmachine');
}

export function exportDataToExcel(data, fileName, sheetName) {
    return axios.post(PM_API + 'export/' + fileName + '/' + sheetName, data, { responseType: 'blob' })
}