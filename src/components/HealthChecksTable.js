import React from 'react'
import GenericTable from './GenericTable';
import { Button, Popup } from 'semantic-ui-react';

export default class HealthChecksTable extends React.PureComponent {
    columns = [
        {
            name: "Title",
            prop: "Title",
            collapsing: true
        },
        {
            name: "Label",
            prop: "Label",
            width: 1,
        },
        {
            name: "Server Name",
            prop: "ServerName",
            width: 2,
        },
        {
            name: "Environment",
            prop: "Environment",
            width: 2,
        },
        {
            name: "Expected Text",
            prop: "ExpectedText",
            width: 1,
        },
        {
            name: "Links",
            prop: "Links",
            width: 1,
            sortable: false,
            searchable: false,
            exportableByDefault: false
        },
        {
            name: "Local IP",
            prop: "LocalIP",
            width: 1,
        },
        {
            name: "Port",
            prop: "Port",
            width: 1,
        },
        {
            name: "RegistryKey",
            prop: "RegistryKey",
            visibleByDefault: false,
            collapsing: true,
        },
        {
            name: "Healthcheck URL",
            prop: "Url",
            visibleByDefault: false,
        },
        {
            name: "KB URL",
            prop: "Knowledgebasearticle",
            visibleByDefault: false,
        }
    ]

    transformDataRow(data) {
        data.LocalIP = data.LocalIP ? "true" : "false"
        data.Links = (
            <>
                <Popup trigger={
                    <Button
                        as="a"
                        href={data.Url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: '0.3em' }}
                        size='medium'
                        icon='medkit' />
                } content='Go to healthcheck URL' inverted />
                <Popup trigger={
                    <Button
                        as="a"
                        href={data.Knowledgebasearticle}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: '0.3em', top: '0.2em' }}
                        size='medium'
                        icon='graduation' />
                } content='Go to KB article' inverted />
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
