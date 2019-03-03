import React from 'react'
import GenericTable from './GenericTable';
import VirtualMachineStatus from './VirtualMachineStatus';

export default class VirtualMachinesTable extends React.PureComponent {
    columns = [
        {
            name: "Name",
            prop: "Name",
            collapsing: true
        },
        {
            name: "Status",
            prop: "Status",
            display: "StatusLabel",
            width: 1,
        },
        {
            name: "Operating System",
            prop: "OperatingSystem",
            width: 2,
            visibleByDefault: false
        },
        {
            name: "CreationTime",
            prop: "CreationTime",
            width: 1,
            visibleByDefault: false
        },
        {
            name: "# CPU",
            prop: "CPUCount",
            collapsing: true
        },
        {
            name: "DynMem?",
            prop: "DynamicMemoryEnabled",
            collapsing: true,
            visibleByDefault: false
        },
        {
            name: "Memory",
            prop: "Memory",
            collapsing: true
        },
        {
            name: "DynMemMax",
            prop: "DynamicMemoryMax",
            collapsing: true,
            visibleByDefault: false
        },
        {
            name: "DynMemMin",
            prop: "DynamicMemoryMin",
            collapsing: true,
            visibleByDefault: false
        },
        {
            name: "VMNetwork",
            prop: "VMNetwork",
            width: 1,
        },
        {
            name: "IPv4",
            prop: "IPv4Addresses",
            width: 2,
        },
        {
            name: "SubnetMask",
            prop: "SubnetMask",
            collapsing: true,
            visibleByDefault: false
        },
        {
            name: "DefaultIPGateways",
            prop: "DefaultIPGateways",
            collapsing: true,
            visibleByDefault: false
        },
        {
            name: "Cloud",
            prop: "Cloud",
            width: 2
        },
        {
            name: "VMSubnet",
            prop: "VMSubnet",
            collapsing: true,
            visibleByDefault: false
        },
        {
            name: "ComputerName",
            prop: "ComputerName",
            collapsing: true,
            visibleByDefault: false
        },
        {
            name: "UserRole",
            prop: "UserRole",
            collapsing: true,
            visibleByDefault: false
        },
        {
            name: "GrantedToList",
            prop: "GrantedToList",
            width: 2
        },
        {
            name: "StartAction",
            prop: "StartAction",
            collapsing: true,
            visibleByDefault: false
        },
        {
            name: "StopAction",
            prop: "StopAction",
            collapsing: true,
            visibleByDefault: false
        },
        {
            name: "VirtualizationPlatform",
            prop: "VirtualizationPlatform",
            collapsing: true,
            visibleByDefault: false
        },
        {
            name: "Tag",
            prop: "Tag",
            collapsing: true,
            visibleByDefault: false
        },
        {
            name: "AvailabilitySet",
            prop: "AvailabilitySet",
            width: 2
        },
        {
            name: "LastUpdate",
            prop: "LastUpdate",
            collapsing: true,
            visibleByDefault: false
        },


    ]

    transformDataRow(data) {
        data.StatusLabel = (<VirtualMachineStatus size="small" status={data.Status} ></VirtualMachineStatus>);

        return data;
    }

    render() {
        return (
            <GenericTable
                columns={this.columns}
                transformDataRow={this.transformDataRow}
                {...this.props}
                />
        );
    }
}
