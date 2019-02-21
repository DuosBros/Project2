import React from 'react'
import GenericTable from './GenericTable';
import VirtualMachineStatus from './VirtualMachineStatus';
import { Popup, Button, Icon } from 'semantic-ui-react';

export default class ActiveDirectoryTable extends GenericTable {
    getColumns() {
        return [
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
        ];
    }

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
                        onClick={() => this.props.deleteADPath(data.Id)}
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
}
