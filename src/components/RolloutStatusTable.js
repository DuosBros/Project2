import React from 'react'
import { Link } from 'react-router-dom';
import GenericTable from './GenericTable';
import AvailabilityStatus from '../components/AvailabilityStatus';
import EnabledStatus from '../components/EnabledStatus';

export default class RolloutStatusTable extends GenericTable {

    getGrouping() {
        return [
            "LbName",
            "Pool"
        ];
    }

    getColumns() {
        return [
            {
                name: "Pool",
                prop: "Pool",
                width: 2,
            },
            {
                name: "LbName",
                prop: "LbName",
                collapsing: true,
                // visibleByDefault: false
            },
            {
                name: "Server",
                prop: "Server",
                display: "ServerLink",
                width: 2,
            },
            {
                name: "IP",
                prop: "Ip",
                width: 2,
            },
            {
                name: "Availability",
                prop: "Availability",
                display: "AvailabilityLabel",
                width: 1
            },
            {
                name: "Enabled",
                prop: "Enabled",
                display: "EnabledLabel",
                width: 1
            },
            {
                name: "Description",
                prop: "Description",
                width: 3
            },
            {
                name: "Version",
                prop: "Version",
                width: 1
            },
            {
                name: "Health",
                prop: "Health",
                width: 1
            },
            {
                name: "LB ID",
                prop: "Lbid",
                collapsing: true,
                visibleByDefault: false
            },
            {
                name: "Port",
                prop: "Port",
                collapsing: true,
                visibleByDefault: false
            },
            {
                name: "Group",
                prop: "RGroup",
                collapsing: true,
                visibleByDefault: false
            }
        ];
    }

    transformDataRow(data) {
        data.ServerLink = (<Link to={'/server/' + data.Serverid}>{data.Server}</Link>);
        data.AvailabilityLabel = (<AvailabilityStatus status={data.Availability} size='small' />);
        data.EnabledLabel = (<EnabledStatus status={data.Enabled} size='small' />);

        return data;
    }

    getDataKey(data) {
        return data.Lbid + "-" + data.Pool + "-" + data.Ip + "-" + data.Port;
    }
}
