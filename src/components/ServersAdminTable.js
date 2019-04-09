import React from 'react'
import GenericTable from './GenericTable';
import { Popup, Button, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Kibana from '../utils/Kibana';
import ServerStatus from './ServerStatus';
import DismeStatus from './DismeStatus';

export default class ServersAdminTable extends React.PureComponent {
    columns = [
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
            name: "Operating System",
            prop: "OperatingSystem",
            width: 4
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
            name: "Actions",
            prop: "Actions",
            width: 1,
            sortable: false,
            searchable: false,
            exportByDefault: false
        }
    ];

    transformDataRow(data) {
        data.Actions = (
            <Popup trigger={
                <Button
                    onClick={() => this.handleDeleteServer(data.Id)}
                    style={{ padding: '0.3em' }}
                    size='medium'
                    icon='delete' />
            } content='Delete server' inverted />
        )
        data.Links = (
            <>
                {/* TODO: once loco provider server.DismeId, uncomment below code
                <Popup trigger={
                    <Button
                        as="a"
                        href={_.replace(DISME_SERVER_URL, new RegExp(DISME_SERVER_PLACEHOLDER, "g"), data.DismeID)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: '0.3em' }}
                        size='medium'
                        icon={
                            <Image src={window.location.protocol + '//' + window.location.host + "/icons/disme.png"} />
                        } />
                } content='Go to Disme details' inverted />
                */}

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
                        href={Kibana.dashboardLinkBuilder("prod", "metricsWindows").addFilter("beat.hostname", data.ServerName).build()}
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
        data.state = (
            <>
                <ServerStatus size='small' serverState={data.ServerState} />
                <DismeStatus size='small' dismeStatus={data.Disme} />
            </>
        );

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
