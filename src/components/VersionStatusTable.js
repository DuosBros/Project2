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
                collapsing: true
            },
            {
                name: "Environment",
                prop: "Environment",
                width: 1,
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
                collapsing: true
            },
            {
                name: "Server Name",
                prop: "ServerName",
                width: 3,
            },
            {
                name: "Version",
                prop: "Version",
                width: 3
            }
        ];
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
