import React from 'react'
import { Button, Popup, Icon } from 'semantic-ui-react';
import GenericTable from './GenericTable';
import moment from 'moment';

export default class LoadBalancersTable extends React.PureComponent {

    columns = [
        {
            name: "Name",
            prop: "Name",
            display: "NameLink",
            width: 2,
        },
        {
            name: "IP",
            prop: "Ip",
            width: 2
        },
        {
            name: "Environment",
            prop: "Environment",
            width: 2
        },
        {
            name: "DC",
            prop: "DataCenter",
            width: 1
        },
        {
            name: "Version",
            prop: "Version",
            width: 2
        },
        {
            name: "LB Token",
            prop: "token",
            width: 2
        },
        {
            name: "Expiration",
            prop: "expiration",
            width: 2
        },
        {
            name: "Action",
            prop: "action",
            width: 1,
            sortable: false,
            searchable: false,
            exportableByDefault: false
        }
    ]

    transformDataRow(data) {
        data.expiration = data.expiration ? moment(data.expiration).local().format("HH:mm:ss DD.MM.YYYY") : null
        if(data.token) {
            data.action = (
                <Popup trigger={
                    <Button
                        onClick={() => this.handleRemoveLBTokenOnClick(data.Id)}
                        style={{ padding: '0.3em' }}
                        size='medium'
                        icon={
                            <Icon name='remove' />
                        } />
                } content='Delete LB Token' inverted />
            )
        }

        data.NameLink = (<a target="_blank" rel="noopener noreferrer" href={"https://" + data.Ip + "/tmui/login.jsp"}>{data.Name}</a>);
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
