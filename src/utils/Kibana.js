import { KIBANA_CONFIG } from '../appConfig';
import rison from 'rison-node';

export default class Kibana {
    static TIME_MODE_RELATIVE = "relative"
    static TIME_MODE_ABSOLUTE = "absolute"
    static ALLOWED_MODES = [
        Kibana.TIME_MODE_RELATIVE,
        Kibana.TIME_MODE_ABSOLUTE
    ]

    static dashboardLinkBuilder(env, dashboard) {
        return new DashboardLinkBuilder(env, dashboard);
    }

    static generateFilter(indexId, key, value) {
        return {
            '$state': { store: "appState" },
            meta: {
                alias: null,
                disabled: false,
                index: indexId,
                key,
                negate: false,
                params: {
                    query: value,
                    type: "phrase"
                },
                type: "phrase",
                value
            },
            query: {
                match: {
                    [key]: {
                        query: value,
                        type: "phrase"
                    }
                }
            }
        };
    }
}

class DashboardLinkBuilder {
    query = null;
    filters = [];
    refresh = false;
    time = {
        mode: Kibana.TIME_MODE_RELATIVE,
        from: "now-2h",
        to: "now"
    }

    constructor(env, dashboard) {
        if(!KIBANA_CONFIG.hasOwnProperty(env)) {
            throw new Error("Unknown envrionment");
        }
        env = this.env = KIBANA_CONFIG[env];

        if(!env.dashboards.hasOwnProperty(dashboard)) {
            throw new Error("Unknown dashboard");
        }
        this.dashboard = env.dashboards[dashboard];
    }

    setQuery(query) {
        this.query = query;
        return this;
    }

    getQuery() {
        return this.query;
    }

    addFilter(key, value) {
        this.filters.push(Kibana.generateFilter(this.dashboard.indexId, key, value));
        return this;
    }

    clearFilters() {
        this.filters = [];
        return this;
    }

    setTime(mode, from, to) {
        if(Kibana.ALLOWED_MODES.indexOf(mode) === -1) {
            throw new Error("Use one of the allowed time modes");
        }

        this.time = {
            mode,
            from,
            to
        };
        return this;
    }

    clearTime() {
        this.time = void 0;
        return this;
    }

    setRefresh(enabled) {
        this.refresh = enabled;
        return this;
    }

    build() {
        let a = {};
        let g = {};
        let qs = "";

        if(this.filters.length > 0) {
            a.filters = this.filters;
        }

        if(this.query) {
            a.query = this.query;
            /*
            a.query = {
                query: {
                    language: "lucene",
                    query: this.query
                }
            };
            */
        }

        if(this.time) {
            // time:(from:'2019-01-18T17:08:43.607Z',mode:absolute,to:'2019-01-18T17:23:43.608Z'))
            // time:(from:now-16m,mode:relative,to:now))
            g.time = this.time;
        }

        if(this.refresh) {
            //refreshInterval:(pause:!t,value:0)
        }

        let params = [];
        // serialize _a
        if(Object.getOwnPropertyNames(a).length > 0) {
            params.push("_a=" + rison.encode(a));
        }
        // serialize _g
        if(Object.getOwnPropertyNames(g).length > 0) {
            params.push("_g=" + rison.encode(g));
        }

        if(params.length > 0) {
            qs = "?" + params.join('&');
        }

        return this.env.baseUrl + "#/dashboard/" + this.dashboard.dashboardId + qs;
    }
}
