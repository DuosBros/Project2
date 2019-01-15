import React from 'react'
import GenericTable from './GenericTable';
import VsStatus from './VsStatus';
import LBPoolStatus from './LBPoolStatus';

export default class LoadBalancerFarmsTable extends GenericTable {
    getColumns() {
        return [
            {
                name: "Data Center",
                prop: "DataCenter",
                visibleByDefault: false,
                width: 1
            },
            {
                name: "Name",
                prop: "Name",
                width: 3
            },
            {
                name: "Pool",
                prop: "Pool",
                width: 3
            },
            {
                name: "VS Status",
                prop: "VsStatus",
                width: 2,
                collapsing: true,
                sortable: false,
                searchable: false
            },
            {
                name: "Pool Status",
                prop: "PoolStatus",
                width: 1,
                collapsing: true,
                sortable: false,
                searchable: false
            },
            {
                name: "Port",
                prop: "Port",
                width: 1,
                collapsing: true
            },
            {
                name: "IP Address",
                prop: "IpAddress",
                width: 2,
                collapsing: true
            },
            {
                name: "Load Balancer Name",
                prop: "LbName",
                width: 2
            },
            {
                name: "Host",
                prop: "Label",
                width: 2
            },
            {
                name: "Env",
                prop: "Environment",
                visibleByDefault: false,
                width: 1
            }
        ];
    }

    onComponentDidMount() {
        this.setState({ showBETAPools: false });
    }

    transformDataRow(data) {
        data.VsStatus = (<VsStatus availabilityState={data.VsAvailabilityState} enabledState={data.VsEnabledState} />);
        data.PoolStatus = (<LBPoolStatus availabilityState={data.PoolAvailabilityState} enabledState={data.PoolEnabledState} />);
        return data;
    }
}
