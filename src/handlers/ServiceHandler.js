import { getServiceByShortcut, getServices } from "../requests/ServiceAxios";
import { searchServiceShortcut } from "../requests/HeaderAxios";

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

export const getServicesHandler = async (getServicesAction) => {
    try {
        let res = await getServices();
        if (res) {
            getServicesAction({ success: true, data: res.data })
            return res;
        }
    } catch (err) {
        getServicesAction({ success: false, error: err })
    }
}

export const handleServiceShortcutSearch = (e, searchServiceShortcutAction) => {
    if (e.target.value.length > 1) {
        searchServiceShortcut(e.target.value.trim())
            .then(res => {
                searchServiceShortcutAction(res.data.map(e => ({ text: e.Name, value: e.Id })))
            })
    }
}