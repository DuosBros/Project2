import _ from 'lodash'
import React, { Component } from 'react'
import { Table, Grid, Input, Button } from 'semantic-ui-react'
import Pagination from 'semantic-ui-react-button-pagination';
import { filterInArrayOfObjects, debounce } from '../utils/HelperFunction';

const COLUMNS = [
    {
        name: "Name",
        prop: "Name",
        width: 3
    },
    {
        name: "Pool",
        prop: "Pool",
        width: 3
    },
    {
        name: "Port",
        prop: "Port",
        width: 1
    },
    {
        name: "IpAddress",
        prop: "IpAddress",
        width: 2
    },
    {
        name: "LoadBalancer Name",
        prop: "LbName",
        width: 3
    },
]

export default class LoadBalancerFarmsBuffedTable extends Component {

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
            filterInputs: {
                IpAddress: "",
                LbName: "",
                Name: "",
                Pool: "",
                Port: "",
            },
            filters: {
                IpAddress: "",
                LbName: "",
                Name: "",
                Pool: "",
                Port: "",
            },
            data: this.props.data
        }

        this.updateFilters = debounce(this.updateFilters, 400);
        this.handleChangeMultisearch = debounce(this.handleChangeMultisearch, 400);
    }

    handleSort = clickedColumn => () => {
        const { column, data, direction } = this.state

        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                data: _.sortBy(data, [element => element[clickedColumn].toLowerCase()]),
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

    handleChange = (e, { name, value }) => {
        let filterInputs = Object.assign({}, this.state.filterInputs, { [name]: value })
        this.setState({ filterInputs });
        this.updateFilters();
    }

    updateFilters = () => {
        this.setState((prev) => ({ filters: prev.filterInputs }));
    }

    handleChangeMultisearch = (e, { name, value }) => {
        this.setState({ multiSearchInput: value });
    }

    handleToggleColumnFilters = () => {
        this.setState({
            showColumnFilters: !this.state.showColumnFilters
         });
    }

    render() {

        const { column, direction, multiSearchInput, defaultLimit, showColumnFilters,
        filterLBFarmIpAddress, filterLBFarmLBName, filterLBFarmName, filterLBFarmPool, filterLBFarmPort, data } = this.state
        // var data = this.props.data.LoadBalancerFarms

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

        if(this.state.showColumnFilters) {
            for(let col of Object.getOwnPropertyNames(this.state.filters)) {
                if(!_.isEmpty(this.state.filters[col])) {
                    filteredData = filteredData.filter(data => {
                        return data[col].search(new RegExp(this.state.filters[col], "i")) >= 0
                    })
                }
            }
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
            let headerFilterCells = COLUMNS.map(c => (
                <Table.HeaderCell width={c.width} key={c.prop}>
                    <Input fluid name={c.name} onChange={this.handleChange} value={this.state.filterInputs[c.prop]} />
                </Table.HeaderCell>
            ))
            filterColumnsRow = (
                <Table.Header>
                    <Table.Row>{headerFilterCells}</Table.Row>
                </Table.Header>
            )
        }
        else {
            filterColumnsRow = null
        }
        let headerCells = COLUMNS.map(c => (
            <Table.HeaderCell
                key={c.prop}
                width={c.width}
                sorted={column === c.prop ? direction : null}
                onClick={this.handleSort(c.prop)}
                content={c.name}
            />
        ))
        return (
            <>
            <Grid>
                <Grid.Column floated='left' width={8}>
                    <Input placeholder="Type to search..." name="multiSearchInput" onChange={this.handleChangeMultisearch} ></Input>
                </Grid.Column>
                <Grid.Column floated='right' width={8} textAlign="right">
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
                </Grid.Column>
            </Grid>
            <Table striped sortable celled basic='very'>
                <Table.Header>
                    <Table.Row>{headerCells}</Table.Row>
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
            </>
        )
    }
}
