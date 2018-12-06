import React from 'react'
import GenericTable from './GenericTable';
import { Link } from 'react-router-dom';
import ServerStatus from './ServerStatus';
import DismeStatus from './DismeStatus';

export default class ServerBuffedTable extends GenericTable {
    getColumns() {
        return [
            {
                name: "Name",
                prop: "ServerName",
                display: "ServerLink",
                width: 3
            },
            {
                name: "Status | Disme",
                prop: "state",
                width: 2,
                sortable: false,
                searchable: false
            },
            {
                name: "Owner",
                prop: "ServerOwner",
                width: 1,
                collapsing: true
            },
            {
                name: "Environment",
                prop: "Environment",
                width: 3,
                collapsing: true
            },
            {
                name: "Data Center",
                prop: "DataCenter",
                width: 1,
                collapsing: true
            },
            {
                name: "Country",
                prop: "CountryName",
                width: 2,
                collapsing: true
            },
            {
                name: "Operating System",
                prop: "OperatingSystem",
                width: 4
            },
            {
                name: "Patch Group",
                prop: "PatchGroupName",
                width: 1,
                visibleByDefault: false
            },
            {
                name: "Patch Group ID",
                prop: "PatchID",
                width: 1,
                visibleByDefault: false
            },
            {
                name: "AD Path",
                prop: "ADPath",
                width: 3,
                visibleByDefault: false
            }
        ];
    }

    transformDataRow(data) {
        data.ServerLink = (<Link to={'/server/' + data.Id}>{data.ServerName}</Link>);
        data.state = (
            <>
                <ServerStatus size='small' serverState={data.ServerState} />
                <DismeStatus size='small' dismeStatus={data.Disme} />
            </>
        );
        return data;
    }
}
