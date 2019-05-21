/*global process*/
export const NODE_ENV = process.env.NODE_ENV
/*global process:false*/

export const APP_TITLE = "LOCO V2 - "

export const LOCO_API = NODE_ENV === 'development' ? 'http://loco.dev.env.works/Api/' : 'http://loco.prod.env.works/Api/';
// export const LOCO_API = "http://localhost:24298/Api/"
export const PM_API = NODE_ENV === 'development' ? 'https://pm.bwin.corp/api/' : "https://pm.bwin.corp/api/"

export const DEFAULT_TIME_FRAME = 720 // in minutes
export const DEFAULT_INTERVAL = 60 // in minutes
export const DEFAULT_SERVER_DEPLOYMENT_COUNT = 8
export const DEFAULT_SERVICE_DEPLOYMENT_COUNT = 30
export const DEFAULT_SERVICE_DEPLOYMENT_TO_RENDER = 2

export const KIBANA_CONFIG = {
    "prod": {
        "baseUrl": "https://kibana.prod.env.works/app/kibana",
        "dashboards": {
            "metricsWindows": {
                "indexId": "bfe4e930-6286-11e8-b346-c9ba44719072",
                "dashboardId": "25494e40-41b4-11e8-9ab2-ab837363b7d6"
            },
            "cpuAndRam": {
                "indexId": "cffa7470-141f-11e9-9136-dd8ce985c8d1",
                "dashboardId": "04622f60-73f7-11e8-9521-777b19549f5d"
            },
            "winlogbeat2": {
                "indexId": "3d424b00-6284-11e8-b346-c9ba44719072",
                "dashboardId": "cbfd81a0-77fd-11e8-be52-174e84611352"
            },
            "appAndWinlog": {
                "indexId": "ef081300-39ad-11e9-920d-6d2e8798c8a2",
                "dashboardId": "13e225a0-3b6e-11e9-920d-6d2e8798c8a2"
            }
        }
    }
}

export const INCIDENT_PLACEHOLDER = "#INCIDENT_PLACEHOLDER"
export const SN_INC_SEARCH_URL = "https://gvcgroup.service-now.com/nav_to.do?uri=textsearch.do?sysparm_ck=sysparm_tsgroups=%26sysparm_view=text_search%26sysparm_search=#INCIDENT_PLACEHOLDER"

export const VERSION1_PLACEHOLDER = "#VERSION1_PLACEHOLDER"
export const VERSION1_SEARCH_URL = "https://www52.v1host.com/GVCGroup/Search.mvc/Advanced?q=#VERSION1_PLACEHOLDER"

export const DISME_SERVICE_PLACEHOLDER = "#DISME_SERVICE_PLACEHOLDER"
export const DISME_SERVICE_URL = "https://disme.bwin.corp/out/out.ServiceMgr.php?serviceid=#DISME_SERVICE_PLACEHOLDER"
export const DISME_SERVER_PLACEHOLDER = "#DISME_SERVER_PLACEHOLDER"
export const DISME_SERVER_URL = "https://disme.bwin.corp/out/out.SrvMgr.php?serverid=#DISME_SERVER_PLACEHOLDER"

export const warningColor = '#f7ead89c'
export const successColor = '#f5fbe7'
export const errorColor = '#f2005614'

export const LBNAME_SUFFIX_WITH_IS = ".is.icepor.com"
export const LBNAME_SUFFIX = ".icepor.com"

export const NWTOOLS_URL = 'https://nw-api.is.icepor.com/'

export const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

export const DEFAULT_TEAMS = [
    { key: 0, text: "B2C", value: "B2C" },
    { key: 1, text: "Trading", value: "Trading" },
    // { key: 2, text: "Linux", value: "Linux" }
]

export const LTMB2CTYPES = [
    { key: 0, text: "Frontend", value: "Frontend" },
    { key: 1, text: "Backend", value: "Backend" },
]
