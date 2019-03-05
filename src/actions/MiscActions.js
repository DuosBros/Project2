import { GET_ENVIRONMENTS } from "../constants/MiscConstants";

export function getEnvironmentsAction(payload) {
    return {
        payload,
        type: GET_ENVIRONMENTS
    }
}