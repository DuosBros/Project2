import _ from 'lodash'
import React, { Component } from 'react'
import { Table, Input, Button } from 'semantic-ui-react'
import Pagination from 'semantic-ui-react-button-pagination';
import { filterInArrayOfObjects, debounce } from '../utils/HelperFunction';

export default class BuffedTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            column: null,
            direction: null,
            showAll: false,
            offset: 0,
            defaultLimit: 15,
            multiSearchInput: "",
            showColumnFilters: false,
            filterLBFarmName: "",
            filterLBFarmPool: "",
            filterLBFarmPort: "",
            filterLBFarmIpAddress: "",
            filterLBFarmLBName: "",
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

    handleToggleColumnFilters = () => {
        this.setState({ 
            showColumnFilters: !this.state.showColumnFilters,
            filterLBFarmName: "",
            filterLBFarmPool: "",
            filterLBFarmPort: "",
            filterLBFarmIpAddress: "",
            filterLBFarmLBName: ""
         });
    }

    render() {

        const { column, direction, multiSearchInput, defaultLimit, showColumnFilters,
        filterLBFarmIpAddress, filterLBFarmLBName, filterLBFarmName, filterLBFarmPool, filterLBFarmPort } = this.state
        var data = this.props.data.LoadBalancerFarms

        var renderData, tableFooter, filteredData, filterColumnsRow;

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

        if(!_.isEmpty(filterLBFarmIpAddress)) {
            filteredData = filteredData.filter(data => {
                return data.IpAddress.search(new RegExp(filterLBFarmIpAddress, "i")) >= 0
            })
        }

        if(!_.isEmpty(filterLBFarmLBName)) {
            filteredData = filteredData.filter(data => {
                return data.LbName.search(new RegExp(filterLBFarmLBName, "i")) >= 0
            })
        }

        if(!_.isEmpty(filterLBFarmName)) {
            filteredData = filteredData.filter(data => {
                return data.Name.search(new RegExp(filterLBFarmName, "i")) >= 0
            })
        }

        if(!_.isEmpty(filterLBFarmPool)) {
            filteredData = filteredData.filter(data => {
                return data.Pool.search(new RegExp(filterLBFarmPool, "i")) >= 0
            })
        }

        if(!_.isEmpty(filterLBFarmPort)) {
            filteredData = filteredData.filter(data => {
                return data.Port.search(new RegExp(filterLBFarmPort, "i")) >= 0
            })
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
                <Table.Footer></Table.Footer>
            )
        }

        if (showColumnFilters) {
            filterColumnsRow = (
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell width={3}>
                            <Input fluid name='filterLBFarmName' onChange={this.handleChange} />
                        </Table.HeaderCell>
                        <Table.HeaderCell width={3}>
                            <Input fluid name='filterLBFarmPool' onChange={this.handleChange} />
                        </Table.HeaderCell>
                        <Table.HeaderCell width={1}>
                            <Input fluid name='filterLBFarmPort' onChange={this.handleChange} />
                        </Table.HeaderCell>
                        <Table.HeaderCell width={2}>
                            <Input fluid name='filterLBFarmIpAddress' onChange={this.handleChange} />
                        </Table.HeaderCell>
                        <Table.HeaderCell width={3}>
                            <Input fluid name='filterLBFarmLBName' onChange={this.handleChange} />
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
            )
        }
        else {
            filterColumnsRow = <Table.Header></Table.Header>
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
                            <br />
                            <Button
                                
                                size="small"
                                onClick={() => this.handleToggleColumnFilters()}
                                compact
                                content={showColumnFilters ? 'Hide Column Filters' : 'Show Column Filters'}
                                style={{ padding: '0.3em', marginTop: '0.5em' }}
                                id="secondaryButton"
                                icon={showColumnFilters ? 'eye slash' : 'eye'}
                                labelPosition='left' />
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
                            sorted={column === 'lbname' ? direction : null}
                            onClick={this.handleSort('lbname')}
                            content='LoadBalancer Name'
                        />
                    </Table.Row>
                </Table.Header>
                {filterColumnsRow}
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