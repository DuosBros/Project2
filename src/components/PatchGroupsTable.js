import React from 'react';
import GenericTable from './GenericTable';
import { Link } from 'react-router-dom';

export default class PatchGroupsTable extends React.PureComponent {
    columns = [
        {
            name: "Id",
            prop: "Id",
            width: 1,
            collapsing: true
        },
        {
            name: "Name",
            prop: "Name",
            display: "NameLink",
            width: 4,
            collapsing: true
        },
        {
            name: "AD Path",
            prop: "ADPATH",
            width: 4,
            collapsing: true
        },
        {
            name: "Country",
            prop: "Country",
            width: 1
        },
        {
            name: "Stage",
            prop: "Stage",
            width: 2
        },
        {
            name: "Main Patch Group",
            prop: "MemberOfGroup",
            width: 3
        },
        {
            name: "# Servers",
            prop: "ServerCount",
            width: 1,
            collapsing: true
        }
    ]

    transformDataRow(data) {
        data.NameLink = (<Link to={'/patchgroup/' + data.Id}>{data.Name}</Link>);

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
