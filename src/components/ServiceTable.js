import React from 'react'
import GenericTable from './GenericTable';
import { Link } from 'react-router-dom';
import DismeStatus from './DismeStatus';
import { DISME_SERVICE_URL, DISME_SERVICE_PLACEHOLDER } from '../appConfig';
import Kibana from '../utils/Kibana';
import { Button, Popup, Image } from 'semantic-ui-react';
import _ from 'lodash';

export default class ServiceTable extends React.PureComponent {
    columns = [
        {
            name: "Name",
            prop: "Name",
            width: 2
        },
        {
            name: "Shortcut",
            prop: "Shortcut",
            display: "ShortcutLink",
            width: 1
        },
        {
            name: "Status",
            prop: "Status",
            display: "Status",
            width: 1
        },
        {
            name: "Owner",
            prop: "Owner",
            searchable: "distinct",
            width: 1
        },
        {
            name: "Application",
            prop: "Application",
            width: 1
        },
        {
            name: "Label",
            prop: "Label",
            width: 1,
        },
        {
            name: "DevFramework",
            prop: "DevFramework",
            width: 1,
        },
        {
            name: "Framework",
            prop: "Framework",
            width: 1,
        },
        {
            name: "Is In IXI [#]",
            prop: "isIXIAndServerCount",
            sortable: false,
            width: 1,
        },
        {
            name: "Is In TSI [#]",
            prop: "isTSIAndServerCount",
            sortable: false,
            width: 1,
        },
        {
            name: "Is HA",
            prop: "isHA",
            sortable: false,
            width: 1,
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
            name: "Poolname",
            prop: "Poolname",
            width: 1,
            visibleByDefault: false
        },
        {
            name: "ServiceName",
            prop: "ServiceName",
            width: 1,
            visibleByDefault: false
        },
        {
            name: "ServiceUser",
            prop: "ServiceUser",
            width: 1,
            visibleByDefault: false
        },
        {
            name: "SiteID",
            prop: "SiteID",
            width: 1,
            visibleByDefault: false
        },

        {
            name: "HomeDir",
            prop: "HomeDir",
            width: 1,
            visibleByDefault: false
        },
        {
            name: "ResponsibleTeam",
            prop: "ResponsibleTeam",
            width: 1,
            visibleByDefault: false
        },
        {
            name: "isWebService",
            prop: "isWebService",
            width: 1,
            visibleByDefault: false
        },
        {
            name: "CreatedAt",
            prop: "CreatedAt",
            width: 1,
            visibleByDefault: false
        },
        {
            name: "LastUpdate",
            prop: "LastUpdate",
            width: 1,
            visibleByDefault: false
        }
    ]

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
                } content='Go to Kibana winlogbeat' inverted />

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
                } content='Go to Kibana perfcounter' inverted />
            </>
        );
        data.Status = (
            <DismeStatus dismeStatus={data.Status} />
        );

        data.ShortcutLink = (<Link to={'/service/' + data.Id}>{data.Shortcut}</Link>);
        return data;
    }

    render() {
        return (
            <GenericTable
                columns={this.columns}
                transformDataRow={this.transformDataRow}
                {...this.props}
                />
        )
    }
}
