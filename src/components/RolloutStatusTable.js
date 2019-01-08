import React from 'react'
import { Link } from 'react-router-dom';
import GenericTable from './GenericTable';
import AvailabilityStatus from '../components/AvailabilityStatus';
import EnabledStatus from '../components/EnabledStatus';
import VanillaHealthStatus from './VanillaHealthStatus';
import { Icon } from 'semantic-ui-react';
import { LBNAME_SUFFIX_WITH_IS, NWTOOLS_URL, LBNAME_SUFFIX } from '../appConfig';

export default class RolloutStatusTable extends GenericTable {

    handleRefresh = (data) => {

        // loading again
        this.props.getHealthAndVersion(true, data.healthInfo.ip, data.versionInfo.serverId, data.healthInfo.serviceId, data.healthInfo.serviceName)
        this.props.getHealthAndVersion(false, data.healthInfo.ip, data.versionInfo.serverId, data.healthInfo.serviceId, data.healthInfo.serviceName)
    }

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
                collapsing: true,
                sortable: false
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

        if ('healthInfo' in data) {
            if (data.healthInfo) {
                if(data.healthInfo.err) {
                    data.Health = (<>{"Error occured - try again"} <Icon className="pointerCursor" onClick={() => this.handleRefresh(data)} name="refresh" /> </>)
                }
                else {
                    data.Health = Array.isArray(data.healthInfo.health) ?
                        <VanillaHealthStatus
                            url={NWTOOLS_URL + 'f5_curl.php?url=/Common/' + data.Pool + "&host=" + data.Ip}
                            status={data.healthInfo.health}
                            size='small' />
                        : "No data"
                }
            }
            else {
                data.Health = "No data"
            }
        }
        else {
            data.Health = <Icon loading name='spinner' />
        }

        if (data.LbName.indexOf(LBNAME_SUFFIX_WITH_IS)) {
            data.LbName = data.LbName.replace(LBNAME_SUFFIX_WITH_IS, '');
        }

        if (data.LbName.indexOf(LBNAME_SUFFIX)) {
            data.LbName = data.LbName.replace(LBNAME_SUFFIX, '');
        }

        if ('versionInfo' in data) {
            if (data.versionInfo) {
                
                if(data.versionInfo.err) {
                    data.Version = (<>{"Error occured - try again"} <Icon className="pointerCursor" onClick={() => this.handleRefresh(data)} name="refresh" /> </>)
                }
                else {
                    data.Version = data.versionInfo.version ? data.versionInfo.version.Version : "No data"
                }
            }
            else {
                data.Version = "No data"
            }
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
