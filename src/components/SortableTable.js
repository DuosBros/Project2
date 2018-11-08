import _ from 'lodash'
import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'

const tableData = [
    { name: 'John', age: 15, gender: 'Male' },
    { name: 'Amber', age: 40, gender: 'Female' },
    { name: 'Leslie', age: 25, gender: 'Female' },
    { name: 'Ben', age: 70, gender: 'Male' },
]

export default class SortableTable extends Component {

    

    state = {
        column: null,
        data: this.props.data,
        direction: null,
    }

    handleSort = clickedColumn => () => {
        const { column, data, direction } = this.state

        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                data: _.sortBy(data, [clickedColumn]),
                direction: 'ascending',
            })

            return
        }

        this.setState({
            data: data.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    }

    render() {
        const { column, data, direction } = this.state

        return (
            <Table sortable celled fixed basic='very'>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell
                            width={3}
                            sorted={column === 'name' ? direction : null}
                            onClick={this.handleSort('name')}
                            content='Name'
                        />
                        <Table.HeaderCell
                            width={3}
                            sorted={column === 'pool' ? direction : null}
                            onClick={this.handleSort('pool')}
                            content='Pool'
                        />
                        <Table.HeaderCell
                            collapsing
                            width={1}
                            sorted={column === 'port' ? direction : null}
                            onClick={this.handleSort('port')}
                            content='Port'
                        />
                        <Table.HeaderCell
                            collapsing
                            width={2}
                            sorted={column === 'ipaddress' ? direction : null}
                            onClick={this.handleSort('ipaddress')}
                            content='IpAddress'
                        />
                        <Table.HeaderCell
                            width={3}
                            sorted={column === 'loadbalancerfarms' ? direction : null}
                            onClick={this.handleSort('loadbalancerfarms')}
                            content='LoadBalancer Farm'
                        />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {_.map(data, ({ Id, Name, Pool, Port, IpAddress, LbName }) => (
                        <Table.Row key={Id}>
                            <Table.Cell>{Name}</Table.Cell>
                            <Table.Cell>{Pool}</Table.Cell>
                            <Table.Cell>{Port}</Table.Cell>
                            <Table.Cell>{IpAddress}</Table.Cell>
                            <Table.Cell>{LbName}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        )
    }
}