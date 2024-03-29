import React, { memo } from 'react';
import { Table } from 'semantic-ui-react';

const SimpleTable = (props) => (

    <Table selectable compact={props.compact} basic='very' size='small'>
        <Table.Header>
            <Table.Row>
                {
                    props.columnProperties.map(property => {
                        return (
                            <Table.HeaderCell key={property.name} width={property.width} content={property.name} />
                        )
                    })
                }
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {props.body}
        </Table.Body>
    </Table>

)

export default memo(SimpleTable);
