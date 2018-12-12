import React from 'react'
import GenericTable from './GenericTable';
import { Link } from 'react-router-dom';

export default class IPAddressesTable extends GenericTable {
    getColumns() {
        return [
            {
                name: "ID",
                prop: "Id",
                width: 2
            },
            {
                name: "IP Address",
                prop: "IpAddress",
                width: 7,
            },
            {
                name: "Server Name",
                prop: "ServerName",
                display: "ServerLink",
                width: 7,
            }
        ];
    }

    transformDataRow(data) {
        data.ServerLink = (<Link to={'/server/' + data.Id}>{data.ServerName}</Link>);
       
        return data;
    }
}
