import React from 'react'
import { Button } from 'semantic-ui-react'
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

    applyCustomFilter(filteredData) {
        const { showBETAPools } = this.state;

        if (!showBETAPools) {
            filteredData = filteredData.filter(x => x.Pool.search(new RegExp("\\.beta\\.", "i")) < 0)
        }
        return filteredData;
    }

    transformDataRow(data) {
        data.VsStatus = (<VsStatus availabilityState={data.VsAvailabilityState} enabledState={data.VsEnabledState} />);
        data.PoolStatus = (<LBPoolStatus availabilityState={data.PoolAvailabilityState} enabledState={data.PoolEnabledState} />);
        return data;
    }

    renderCustomFilter() {
        const { showBETAPools } = this.state;
        return (
            <div>
                <Button
                    fluid
                    size="small"
                    name="showBETAPools"
                    onClick={this.handleStateToggle}
                    compact
                    content={showBETAPools ? 'Hide BETA Pools' : 'Show BETA Pools'}
                    style={{ padding: '0.3em', marginTop: '0.5em', textAlign: 'right' }}
                    id="secondaryButton"
                    icon={showBETAPools ? 'eye slash' : 'eye'}
                    labelPosition='left' />
            </div>
        );
    }
}
