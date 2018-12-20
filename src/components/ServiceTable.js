import React from 'react'
import GenericTable from './GenericTable';
import { Link } from 'react-router-dom';
import DismeStatus from './DismeStatus';
import { DISME_SERVICE_URL, DISME_SERVICE_PLACEHOLDER, KIBANA_WINLOGBEAT_SERVICE_URL, KIBANA_SERVICE_URL_PLACEHOLDER, KIBANA_PERFCOUNTER_SERVICE_URL } from '../appConfig';
import { Button, Popup, Image } from 'semantic-ui-react';
import _ from 'lodash';

export default class ServiceTable extends GenericTable {
    getColumns() {
        return [
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
                name: "Links",
                prop: "Links",
                width: 1,
                sortable: false,
                searchable: false
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
        ];
    }

    transformDataRow(data) {
        data.Links = (
            <>
                <Popup trigger={
                    <Button
                        onClick={() =>
                            window.open(
                                _.replace(DISME_SERVICE_URL, new RegExp(DISME_SERVICE_PLACEHOLDER, "g"),
                                    data.DismeID))}
                        style={{ padding: '0.3em' }}
                        size='medium'
                        icon={
                            <Image src={window.location.protocol + '//' + window.location.host + "/icons/disme.png"} />
                        } />
                } content='Go to Disme details' inverted />


                <Popup trigger={
                    <Button
                        onClick={() =>
                            window.open(
                                _.replace(KIBANA_WINLOGBEAT_SERVICE_URL, new RegExp(KIBANA_SERVICE_URL_PLACEHOLDER, "g"),
                                    data.Shortcut))}
                        style={{ padding: '0.3em' }}
                        size='medium'
                        icon={
                            <Image src={window.location.protocol + '//' + window.location.host + "/icons/kibana.png"} />
                        } />
                } content='Go to Kibana winlogbeat' inverted />

                <Popup trigger={
                    <Button
                        onClick={() =>
                            window.open(
                                _.replace(KIBANA_PERFCOUNTER_SERVICE_URL, new RegExp(KIBANA_SERVICE_URL_PLACEHOLDER, "g"),
                                    data.Shortcut))}
                        style={{ padding: '0.3em' }}
                        size='medium'
                        icon={
                            <Image src={window.location.protocol + '//' + window.location.host + "/icons/kibana.png"} />
                        } />
                } content='Go to Kibana perfcounter' inverted />
                {/* <a target="_blank" rel="noopener noreferrer" href={_.replace(KIBANA_WINLOGBEAT_SERVICE_URL, new RegExp(KIBANA_SERVICE_URL_PLACEHOLDER, "g"), serviceDetails.Service[0].Shortcut)}>Eventlog</a><br />
                <a target="_blank" rel="noopener noreferrer" href={_.replace(KIBANA_PERFCOUNTER_SERVICE_URL, new RegExp(KIBANA_SERVICE_URL_PLACEHOLDER, "g"), serviceDetails.Service[0].Shortcut)}>PerfCounter</a> */}
            </>
        );
        data.Status = (
            <DismeStatus dismeStatus={data.Status} />
        );

        data.ShortcutLink = (<Link to={'/service/' + data.Id}>{data.Shortcut}</Link>);
        return data;
    }
}
