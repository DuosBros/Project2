import _ from 'lodash'
import React, { Component } from 'react'
import { Table, Input } from 'semantic-ui-react'
import Pagination from 'semantic-ui-react-button-pagination';
import { filterInArrayOfObjects, debounce } from '../utils/HelperFunction';

export default class SortableTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            column: null,
            direction: null,
            showAll: false,
            offset: 0,
            defaultLimit: 15,
            multiSearchInput: ""
        }

        this.handleChange = debounce(this.handleChange, 400);
        this.handleChange = this.handleChange.bind(this)
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

    handleClick(offset) {
        this.setState({ offset });
    }

    handleChange(e, { name, value }) {
        this.setState({ [name]: value })
    }

    render() {

        const { column, direction, multiSearchInput, defaultLimit } = this.state
        var data = this.props.data.LoadBalancerFarms

        var renderData, tableFooter, filteredData;

        if (multiSearchInput !== "") {
            var fuckoff = data.map(pic => {
                return (
                    {
                        Id: pic.Id,
                        Name: pic.Name,
                        Pool: pic.Pool,
                        Port: pic.Port,
                        IpAddress: pic.IpAddress,
                        LbName: pic.LbName
                    }

                )
            })

            filteredData = filterInArrayOfObjects(multiSearchInput, fuckoff)
        }
        else {
            filteredData = data
        }

        if (filteredData.length > defaultLimit) {
            renderData = filteredData.slice(this.state.offset, this.state.offset + defaultLimit)
            tableFooter = (
                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell colSpan='5'>
                            <Pagination
                                compact
                                reduced
                                size="small"
                                floated="right"
                                offset={this.state.offset}
                                limit={defaultLimit}
                                total={filteredData.length}
                                onClick={(e, props, offset) => this.handleClick(offset)}
                            />
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            )
        }
        else {
            renderData = filteredData
            tableFooter = (
                <Table.Row></Table.Row>
            )
        }


        return (
            <Table striped sortable celled basic='very'>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan={2} textAlign="left">
                            <Input placeholder="Type to search..." name="multiSearchInput" onChange={this.handleChange} ></Input>
                        </Table.HeaderCell>
                        <Table.HeaderCell colSpan={3} textAlign="right">
                            Showing {this.state.offset + 1} to {filteredData.length < defaultLimit ? filteredData.length : this.state.offset + 15} of {filteredData.length} entries
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
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
                            width={1}
                            sorted={column === 'port' ? direction : null}
                            onClick={this.handleSort('port')}
                            content='Port'
                        />
                        <Table.HeaderCell
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
                    {_.map(renderData, ({ Id, Name, Pool, Port, IpAddress, LbName }) => (
                        <Table.Row key={Id}>
                            <Table.Cell>{Name}</Table.Cell>
                            <Table.Cell>{Pool}</Table.Cell>
                            <Table.Cell>{Port}</Table.Cell>
                            <Table.Cell>{IpAddress}</Table.Cell>
                            <Table.Cell>{LbName}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
                {tableFooter}
            </Table>
        )
    }
}