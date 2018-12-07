import React from 'react'
import GenericTable from './GenericTable';
import { Link } from 'react-router-dom';
import ServerStatus from './ServerStatus';
import DismeStatus from './DismeStatus';

export default class ServersTable extends GenericTable {
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
                collapsing: true
            },
            {
                name: "Country",
                prop: "CountryName",
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
            },
            {
                name: "LastUpdate",
                prop: "LastUpdate",
                width: 1,
                visibleByDefault: false
            },
            {
                name: "Domain",
                prop: "Domain",
                width: 1,
                visibleByDefault: false
            },
            {
                name: "FQDN",
                prop: "FQDN",
                width: 1,
                visibleByDefault: false
            },
            {
                name: "Stage",
                prop: "Stage",
                width: 1,
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
