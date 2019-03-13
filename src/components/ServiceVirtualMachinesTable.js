import React from 'react'
import GenericTable from './GenericTable';
import { Popup, Button, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Kibana from '../utils/Kibana';
import DismeStatus from './DismeStatus';
import VirtualMachineStatus from './VirtualMachineStatus';
import { DISME_SERVICE_URL, DISME_SERVICE_PLACEHOLDER } from '../appConfig';
import _ from 'lodash';

export default class ServiceVirtualMachinesTable extends React.PureComponent {
    columns = [
        {
            name: "ServiceName",
            prop: "ServiceName"
        },
        {
            name: "Shortcut",
            prop: "Shortcut",
            display: "ShortcutLink"
        },
        {
            name: "VM Name",
            prop: "VMName",
            display: "ServerLink"
        },
        {
            name: "Owner",
            prop: "ServiceOwner",
        },
        {
            name: "Status",
            prop: "ServiceStatus",
            display: "StatusLabel"
        },
        {
            name: "VMStatus",
            prop: "VMStatus",
            display: "VMStatusLabel"
        },
        {
            name: "IP",
            prop: "IPv4Addresses",
        },
        {
            name: "Operating System",
            prop: "OperatingSystem",
        },
        {
            name: "Virtualization",
            prop: "VirtualizationPlatform",
        },
        {
            name: "Vendor",
            prop: "Vendor"
        },
        {
            name: "SupportContract",
            prop: "SupportContract"
        },
        {
            name: "Role",
            prop: "Role"
        },
        {
            name: "Links",
            prop: "Links",
            width: 1,
            sortable: false,
            searchable: false,
            exportByDefault: false
        },
        {
            name: "ServiceUser",
            prop: "ServiceUser",
            visibleByDefault: false
        },
        {
            name: "Pool",
            prop: "PoolName",
            visibleByDefault: false
        },
        {
            name: "Framework",
            prop: "Framework",
            visibleByDefault: false
        },
        {
            name: "HomeDir",
            prop: "HomeDir",
            visibleByDefault: false
        },
        {
            name: "SiteID",
            prop: "SiteID",
            visibleByDefault: false
        },
        {
            name: "ServiceCreated",
            prop: "CreatedAt",
            visibleByDefault: false
        },
        {
            name: "ServiceLastUpdate",
            prop: "ServiceLastUpdate",
            visibleByDefault: false
        },
        {
            name: "isWebService",
            prop: "isWebService",
            visibleByDefault: false
        },
        {
            name: "DevFramework",
            prop: "DevFramework",
            visibleByDefault: false
        },
        {
            name: "Product",
            prop: "Product",
            visibleByDefault: false
        },
        {
            name: "ResponsibleTeam",
            prop: "ResponsibleTeam",
            visibleByDefault: false
        },
        {
            name: "VMCreated",
            prop: "CreationTIme",
            visibleByDefault: false
        },
        {
            name: "# CPU",
            prop: "CPUCount",
            visibleByDefault: false
        },
        {
            name: "DynMem?",
            prop: "DynamicMemoryEnabled",
            visibleByDefault: false
        },
        {
            name: "Memory",
            prop: "Memory",
            visibleByDefault: false
        },
        {
            name: "DynMemMax",
            prop: "DynamicMemoryMax",
            visibleByDefault: false
        },
        {
            name: "DynMemMin",
            prop: "DynamicMemoryMin",
            visibleByDefault: false
        },
        {
            name: "VMNetwork",
            prop: "VMNetwork",
            visibleByDefault: false
        },
        {
            name: "SubnetMask",
            prop: "SubnetMask",
            visibleByDefault: false
        },
        {
            name: "DefaultIPGateways",
            prop: "DefaultIPGateways",
            visibleByDefault: false
        },
        {
            name: "Cloud",
            prop: "Cloud",
            visibleByDefault: false
        },
        {
            name: "VMSubnet",
            prop: "VMSubnet",
            visibleByDefault: false
        },
        {
            name: "UserRole",
            prop: "UserRole",
            visibleByDefault: false
        },
        {
            name: "GrantedToList",
            prop: "GrantedToList",
            visibleByDefault: false
        },
        {
            name: "StartAction",
            prop: "StartAction",
            visibleByDefault: false
        },
        {
            name: "StopAction",
            prop: "StopAction",
            visibleByDefault: false
        },
        {
            name: "AvailabilitySet",
            prop: "AvailabilitySet",
            visibleByDefault: false
        },
        {
            name: "VM LastUpdate",
            prop: "VMLastUpdate",
            visibleByDefault: false
        },
    ];

    transformDataRow(data) {

        data.Links = (
            <>
                <Popup trigger={
                    <Button
                        as="a"
                        href={_.replace(DISME_SERVICE_URL, new RegExp(DISME_SERVICE_PLACEHOLDER, "g"), data.DismeID)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: '0.3em' }}
                        size='medium'
                        icon={
                            <Image src={window.location.protocol + '//' + window.location.host + "/icons/disme.png"} />
                        } />
                } content='Go to Disme details' inverted />

                <Popup trigger={
                    <Button
                        as="a"
                        href={Kibana.dashboardLinkBuilder("prod", "winlogbeat2").addFilter("app", data.Shortcut).build()}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: '0.3em' }}
                        size='medium'
                        icon={
                            <Image src={window.location.protocol + '//' + window.location.host + "/icons/kibana.png"} />
                        } />
                } inverted>
                    <Popup.Content>
                        Go to Kibana {data.Shortcut} winlogbeat
                    </Popup.Content>
                </Popup>

                <Popup trigger={
                    <Button
                        as="a"
                        href={Kibana.dashboardLinkBuilder("prod", "cpuAndRam").addFilter("app", data.Shortcut).setQuery("NOT beat.hostname:*PRE*").build()}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: '0.3em' }}
                        size='medium'
                        icon={
                            <Image src={window.location.protocol + '//' + window.location.host + "/icons/kibana.png"} />
                        } />
                } inverted>
                    <Popup.Content>
                        Go to Kibana {data.Shortcut} perfcounter
                </Popup.Content>
                </Popup>
            </>
        );

        data.ShortcutLink = (<Link to={'/service/' + data.ServiceId}>{data.Shortcut}</Link>);

        data.StatusLabel = (
            <DismeStatus dismeStatus={data.ServiceStatus} />
        );
        data.VMStatusLabel = data.VMStatus ? (<VirtualMachineStatus size="small" status={data.VMStatus} ></VirtualMachineStatus>) : null;

        data.ServerLink = (<Link to={'/server/' + data.ServerId}>{data.VMName}</Link>);

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
