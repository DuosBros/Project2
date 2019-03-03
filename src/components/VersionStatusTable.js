import React from 'react';
import GenericTable from './GenericTable';
import { getServerState } from '../utils/HelperFunction';
import ServerStatus from './ServerStatus';

export default class VersionStatusTable extends React.PureComponent {
    columns = [
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
    ]

    getDataKey(data) {
        return data.ServerName;
     }

    grouping = [
        "Environment"
    ]

    transformDataRow(data) {
        data.ServerState = (<ServerStatus size="small" serverState={getServerState(data.ServerState)} ></ServerStatus>);

        return data;
    }

    render() {
        return (
            <GenericTable
                columns={this.columns}
                grouping={this.grouping}
                transformDataRow={this.transformDataRow}
                getDataKey={this.getDataKey}
                {...this.props}
                />
        );
    }
}
