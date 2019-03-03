import React, { Component } from 'react';
import GenericTable from './GenericTable';

export default class WindowsServicesTable extends Component {
    columns = [
        {
            name: "Service Name",
            prop: "ServiceName",
            collapsing: true
        },
        {
            name: "Display Name",
            prop: "DisplayName",
            collapsing: true
        },
        {
            name: "StartupType",
            prop: "StartupType",
            collapsing: true
        },
        {
            name: "State",
            prop: "State",
            styleProp: "StateAlert",
            collapsing: true
        },
        {
            name: "User",
            prop: "User",
            collapsing: true
        }
    ]

    render() {
        return (
            <GenericTable
                columns={this.columns}
                {...this.props}
                />
        );
    }
}
