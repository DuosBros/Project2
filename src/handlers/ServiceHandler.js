import { getServiceByShortcut, getServices } from "../requests/ServiceAxios";

export const getServiceDetailsByShortcutHandler = (services, getServiceDetailsByShortcutsAction) => {
    getServiceByShortcut(services)
        .then(res => {
            if (res.data) {
                getServiceDetailsByShortcutsAction({ success: true, data: res.data })
            }
            else {
                getServiceDetailsByShortcutsAction({ success: true, data: [] })
            }
        })
        .catch(err => {
            getServiceDetailsByShortcutsAction({ success: false, error: err })
        })
}

export const getServicesHandler = (getServicesAction) => {
    getServices()
        .then(res => {
            getServicesAction({ success: true, data: res.data })
        })
        .catch(err => {
            getServicesAction({ success: false, error: err })
        })
}