import React, { Component } from 'react'
import GenericTable from './GenericTable';
import { Popup, Button, Icon } from 'semantic-ui-react';

export default class ActiveDirectoryTable extends Component {
    columns = [
        {
            name: "AD Path",
            prop: "ADPath"
        },
        {
            name: "Action",
            prop: "Action",
            sortable: false,
            searchable: false,
        }
    ]

    transformDataRow(data) {
        data.Action = (
            <>
                <Popup trigger={
                    <Button
                        onClick={() => this.props.handleEditOnClick({ Id: data.Id, ADPath: data.ADPath })}
                        style={{ padding: '0.3em' }}
                        size='medium'
                        icon={
                            <Icon name='edit' />
                        } />
                } content='Edit AD Path' inverted />

                <Popup trigger={
                    <Button
                        onClick={() => this.props.handleDeleteButtonOnClick(data.Id)}
                        style={{ padding: '0.3em' }}
                        size='medium'
                        icon={
                            <Icon name='remove' />
                        } />
                } content='Remove AD Path' inverted />
            </>
        )
        // data.StatusLabel = (<VirtualMachineStatus size="small" status={data.Status} ></VirtualMachineStatus>);

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
