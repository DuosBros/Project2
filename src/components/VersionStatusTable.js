import GenericTable from './GenericTable';
import { getServerState } from '../utils/HelperFunction';
import ServerStatus from './ServerStatus';
import React from 'react';

export default class VersionStatusTable extends GenericTable {
    getColumns() {
        return [
            {
                name: "Shortcut",
                prop: "Shortcut",
                width: 2
            },
            {
                name: "Environment",
                prop: "Environment",
                width: 2,
            },
            {
                name: "Datacenter",
                prop: "Datacenter",
                width: 1,
            },
            {
                name: "Server Group",
                prop: "ServerGroup",
                width: 1,
            },
            {
                name: "Server State",
                prop: "ServerState",
                width: 1
            },
            {
                name: "Server Name",
                prop: "ServerName",
                width: 3,
            },
            {
                name: "Version",
                prop: "Version",
            }
        ];
    }

    getDataKey(data) {
        return data.ServerName;
     }

    getGrouping() {
        return [
            "Environment"
        ];
    }

    transformDataRow(data) {
        data.ServerState = (<ServerStatus size="small" serverState={getServerState(data.ServerState)} ></ServerStatus>);

        return data;
    }
}
