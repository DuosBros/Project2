import React from 'react'
import { Link } from 'react-router-dom';
import GenericTable from './GenericTable';

export default class WebsitesBuffedTable extends GenericTable {

    getGrouping() {
        return [
            "Environment"
        ];
    }

    getColumns() {
        return [
            {
                name: "Server Name",
                prop: "ServerName",
                display: "ServerLink",
                width: 1
            },
            {
                name: "Environment",
                prop: "Environment",
                width: 2,
                visibleByDefault: false
            },
            {
                name: "Site ID",
                prop: "SiteId",
                width: 1,
                collapsing: true
            },
            {
                name: "AppPool Name",
                prop: "AppPoolName",
                width: 3,
                collapsing: true
            },
            {
                name: "Bindings",
                prop: "Bindings",
                display: "BindingsDisplay",
                width: 1,
                collapsing: true
            },
            {
                name: "Framework",
                prop: "Framework",
                width: 2,
                collapsing: true
            },
            {
                name: "AutoStart",
                prop: "AutoStart",
                width: 1
            },
            {
                name: "User",
                prop: "User",
                width: 1
            },
            {
                name: "State",
                prop: "State",
                width: 1
            },
            {
                name: "Recycle",
                prop: "PeriodicRecycle",
                width: 1,
                visibleByDefault: false
            },
            {
                name: "IdleTimeout",
                prop: "IdleTimeout",
                width: 1,
                visibleByDefault: false
            }
        ];
    }

    transformDataRow(data) {
        data.ServerLink = (<Link to={'/server/' + data.Id}>{data.ServerName}</Link>);
        if (data.Bindings) {
            data.BindingsDisplay = data.Bindings.map((binding, i) => {
                return (
                    <React.Fragment key={i}>
                        {binding.IpAddress + ":" + binding.Port + ":" + binding.Binding} 
                        <br />
                    </React.Fragment>
                );
            });
        } else {
            data.BindingsDisplay = "";
        }

        return data;
    }
}
