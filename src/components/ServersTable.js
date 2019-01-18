import React from 'react'
import GenericTable from './GenericTable';
import { Popup, Button, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Kibana from '../utils/Kibana';
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
                name: "State",
                prop: "ServerState",
                display: "StateLabel",
                width: 1
            },
            {
                name: "Disme",
                prop: "Disme",
                display: "DismeLabel",
                collapsing: true
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
                name: "Links",
                prop: "Links",
                width: 1,
                sortable: false,
                searchable: false
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
        data.Links = (
            <>
                <Popup trigger={
                    <Button
                        as="a"
                        href={Kibana.dashboardLinkBuilder("prod", "winlogbeat2").addFilter("beat.hostname", data.ServerName).build()}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: '0.3em' }}
                        size='medium'
                        icon={
                            <Image src={window.location.protocol + '//' + window.location.host + "/icons/kibana.png"} />
                        } />
                } content='Go to Kibana winlogbeat' inverted />

                <Popup trigger={
                    <Button
                        as="a"
                        href={Kibana.dashboardLinkBuilder("prod", "metricsWindows").addFilter("beat.hostname",data.ServerName).build()}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: '0.3em' }}
                        size='medium'
                        icon={
                            <Image src={window.location.protocol + '//' + window.location.host + "/icons/kibana.png"} />
                        } />
                } content='Go to Kibana perfcounter' inverted />
            </>
        );

        data.ServerLink = (<Link to={'/server/' + data.Id}>{data.ServerName}</Link>);
        data.StateLabel = (
            <ServerStatus size='small' serverState={data.ServerState} />
        );
        data.DismeLabel = (
            <DismeStatus size='small' dismeStatus={data.Disme} />
        );
        return data;
    }
}
