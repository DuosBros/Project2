import React from 'react'
import { Link } from 'react-router-dom';
import GenericTable from './GenericTable';
import AvailabilityStatus from '../components/AvailabilityStatus';
import EnabledStatus from '../components/EnabledStatus';
import VanillaHealthStatus from './VanillaHealthStatus';
import { Icon } from 'semantic-ui-react';
import { LBNAME_SUFFIX } from '../appConfig';

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
                width: 1,
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
                collapsing: true
            },
            {
                name: "Health",
                prop: "Health",
                display: "HealthLabel",
                collapsing: true
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
        data.HealthLabel = (data.health ? <VanillaHealthStatus status={data.health} size='small' /> : <Icon loading name='spinner' />);

        if (data.LbName.indexOf(LBNAME_SUFFIX)) {
            data.LbName = data.LbName.replace(LBNAME_SUFFIX, '');
        }
        if ('version' in data) {
            data.Version = data.Version ? data.Version : "No data"
        }
        else {
            data.Version = <Icon loading name='spinner' />
        }

        return data;
    }

    getDataKey(data) {
        return data.Lbid + "-" + data.Pool + "-" + data.Ip + "-" + data.Port;
    }
}
