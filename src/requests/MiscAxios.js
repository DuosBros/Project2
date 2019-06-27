import axios from 'axios';
import { LOCO_API, PM_API, JOBS } from '../appConfig';

export function getServiceVirtualMachines() {
    return axios.get(LOCO_API + 'servicevirtualmachine');
}

export function exportDataToExcel(data, fileName) {
    return axios.post(PM_API + 'export/' + fileName, data, { responseType: 'blob' })
}

export function getStages() {
    return axios.get(LOCO_API + 'stage');
}

export function executeJob(type, job) {
    let url;

    if (type === JOBS[0].type) {
        url = LOCO_API.replace("Api", "lbapi") + "job/" + job + "/start"
    }

    if (type === JOBS[1].type) {
        url = LOCO_API + job + "/job" + "/start"
    }

    return axios.get(url, { withCredentials: true });
}