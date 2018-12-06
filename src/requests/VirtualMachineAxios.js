import axios from 'axios';
import { LOCO_API } from '../appConfig';

export function getVirtualMachines() {
    return axios.get(LOCO_API + 'vm');
}