import _ from 'lodash'
import React, { Component } from 'react'
import { Table, Grid, Input, Button, Icon, Message } from 'semantic-ui-react'
import Pagination from 'semantic-ui-react-button-pagination';
import { filterInArrayOfObjects, debounce } from '../utils/HelperFunction';
import VsStatus from './VsStatus';
import LBPoolStatus from './LBPoolStatus';
var COLUMNS = [
    {
        name: "Name",
        prop: "Name",
        width: 3,
        collapsing: false
    },
    {
        name: "Pool",
        prop: "Pool",
        width: 3,
        collapsing: false
    },
    {
        name: "VsStatus",
        prop: "VsStatus",
        width: 2,
        collapsing: true
    },
    {
        name: "PoolStatus",
        prop: "PoolStatus",
        width: 1,
        collapsing: true
    },
    {
        name: "Port",
        prop: "Port",
        width: 1,
        collapsing: true
    },
    {
        name: "IpAddress",
        prop: "IpAddress",
        width: 2,
        collapsing: true
    },
    {
        name: "LoadBalancer Name",
        prop: "LbName",
        width: 2,
        collapsing: false
    }
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
            multiSearchInput: this.props.multiSearchInput ? this.props.multiSearchInput : "",
            showColumnFilters: false,
            filterInputs: {
                IpAddress: "",
                LbName: "",
                Name: "",
                Pool: "",
                PoolStatus: "",
                VsStatus: "",
                Port: "",
            },
            filters: {
                IpAddress: "",
                LbName: "",
                Name: "",
                Pool: "",
                PoolStatus: "",
                VsStatus: "",
                Port: "",
            },
            data: this.props.data,
            showBETAPools: false
        }

        this.updateFilters = debounce(this.updateFilters, 400);
        // this.handleChangeMultisearch = debounce(this.handleChangeMultisearch, 400);
    }

    componentDidMount() {
        console.log("callsed componentdidmount")
        if (this.props.isEdit) {
            var isAddedAlready = COLUMNS.filter(x => x.name === "Actions")
            if (isAddedAlready.length === 0) {
                COLUMNS.push(
                    {
                        name: "Actions",
                        prop: "a",
                        width: 1,
                        collapsing: false
                    })
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.data });
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

        const { column, direction, multiSearchInput, defaultLimit,
            showColumnFilters, data, filters, offset, showBETAPools } = this.state

        var renderData, tableFooter, filteredData, filterColumnsRow, isEdit, loadBalancerFarmsBuffedTableComponent, loadBalancerFarmsToAdd, loadBalancerFarmsToRemove;

        isEdit = this.props.isEdit;

        if(isEdit) {
            loadBalancerFarmsToAdd = this.props.parentState.loadBalancerFarmsToAdd;
            loadBalancerFarmsToRemove = this.props.parentState.loadBalancerFarmsToRemove;
        }

        let headerCells = COLUMNS.map(c => (
            <Table.HeaderCell
                collapsing={c.collapsing}
                key={c.prop}
                width={c.collapsing ? null : c.width}
                sorted={column === c.prop ? direction : null}
                onClick={this.handleSort(c.prop)}
                content={c.name}
            />
        ))

        if (multiSearchInput !== "") {
            var mappedData = data.map(pic => {
                return (
                    {
                        Id: pic.Id,
                        Name: pic.Name,
                        Pool: pic.Pool,
                        VsAvailabilityState: pic.VsAvailabilityState,
                        VsEnabledState: pic.VsEnabledState,
                        PoolAvailabilityState: pic.PoolAvailabilityState,
                        PoolEnabledState: pic.PoolEnabledState,
                        Port: pic.Port,
                        IpAddress: pic.IpAddress,
                        LbName: pic.LbName
                    }
                )
            })

            filteredData = filterInArrayOfObjects(multiSearchInput, mappedData)
        }
        else {
            filteredData = data
        }

        if (!showBETAPools) {
            filteredData = filteredData.filter(x => {
                return x.Pool.search(new RegExp(".beta.", "i")) < 0
            })
        }

        if (showColumnFilters) {
            for (let col of Object.getOwnPropertyNames(filters)) {
                if (!_.isEmpty(filters[col])) {
                    filteredData = filteredData.filter(data => {
                        return data[col].search(new RegExp(filters[col], "i")) >= 0
                    })
                }
            }
        }

        if (filteredData.length > defaultLimit) {
            renderData = filteredData.slice(offset, offset + defaultLimit)
            tableFooter = (
                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell colSpan='7'>
                            <Pagination
                                compact
                                reduced
                                size="small"
                                floated="right"
                                offset={offset}
                                limit={defaultLimit}
                                total={filteredData.length}
                                onClick={(e, props, o) => this.handleClick(o)}
                            />
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            )
        }
        else {
            renderData = filteredData
            tableFooter = (
                null
            )
        }

        if (showColumnFilters) {
            let headerFilterCells = COLUMNS.map(c => (
                <Table.HeaderCell collapsing={c.collapsing} width={c.collapsing ? null : c.width} key={c.prop}>
                    <Input fluid name={c.prop} onChange={this.handleChange} value={this.state.filterInputs[c.prop]} />
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


        var tableBody = renderData.map(data => (
            <Table.Row positive={isEdit.isAdd && loadBalancerFarmsToAdd.indexOf(data.Id) > -1}
                negative={isEdit.isAdd === false && loadBalancerFarmsToRemove.indexOf(data.Id) > -1}
                key={data.Id}>
                <Table.Cell>{data.Name}</Table.Cell>
                <Table.Cell>{data.Pool}</Table.Cell>
                <Table.Cell>
                    <VsStatus availabilityState={data.VsAvailabilityState} enabledState={data.VsEnabledState} />
                </Table.Cell>
                <Table.Cell>
                    <LBPoolStatus availabilityState={data.PoolAvailabilityState} enabledState={data.PoolEnabledState} />
                </Table.Cell>
                <Table.Cell>{data.Port}</Table.Cell>
                <Table.Cell>{data.IpAddress}</Table.Cell>
                <Table.Cell>{data.LbName}</Table.Cell>
                {
                    isEdit ? (
                        <Table.Cell>
                            <Button onClick={isEdit.isAdd ? () => this.props.handleAdd(data.Id) : () => this.props.handleRemove(data.Id)} style={{ padding: '0.3em' }} size='medium'
                                icon={
                                    <>
                                        <Icon name='balance' />
                                        {
                                            isEdit.isAdd ? (
                                                loadBalancerFarmsToAdd.indexOf(data.Id) > -1 ? (<Icon color="red" corner name='minus' />) : (<Icon color="green" corner name='add' />)
                                            ) : (
                                                    loadBalancerFarmsToRemove.indexOf(data.Id) > -1 ? (<Icon color="green" corner name='add' />) : (<Icon color="red" corner name='minus' />)
                                                )
                                        }
                                    </>
                                } >
                            </Button>
                        </Table.Cell>
                    ) : (
                            null
                        )
                }

            </Table.Row>
        ))

        // if (headerCells && tableBody) {
        //     if (this.props.data.length > 0) {

        loadBalancerFarmsBuffedTableComponent = (
            <>
                <Grid>
                    <Grid.Column floated='left' width={4}>
                        <Input
                            label='filter:'
                            id="multiSearchFilterInBuffedTable"
                            fluid
                            value={multiSearchInput} placeholder="Type to search..." name="multiSearchInput" onChange={this.handleChangeMultisearch} ></Input>
                    </Grid.Column>
                    <Grid.Column width={10} >

                    </Grid.Column>
                    <Grid.Column floated='right' width={2} textAlign="right">
                        Showing {this.state.offset + 1} to {filteredData.length < defaultLimit ? filteredData.length : this.state.offset + 15} of {filteredData.length} entries
                            <br />
                        <Button
                            fluid
                            size="small"
                            onClick={() => this.handleToggleColumnFilters()}
                            compact
                            content={showColumnFilters ? 'Hide Column Filters' : 'Show Column Filters'}
                            style={{ padding: '0.3em', marginTop: '0.5em', textAlign: 'right' }}
                            id="secondaryButton"
                            icon={showColumnFilters ? 'eye slash' : 'eye'}
                            labelPosition='left' />
                        <Button
                            fluid
                            size="small"
                            onClick={() => this.setState({ showBETAPools: !this.state.showBETAPools })}
                            compact
                            content={showBETAPools ? 'Hide BETA Pools' : 'Show BETA Pools'}
                            style={{ padding: '0.3em', marginTop: '0.5em', textAlign: 'right' }}
                            id="secondaryButton"
                            icon={showBETAPools ? 'eye slash' : 'eye'}
                            labelPosition='left' />
                    </Grid.Column>
                </Grid>
                <Table selectable sortable celled basic='very'>
                    <Table.Header>
                        <Table.Row>{headerCells}</Table.Row>
                    </Table.Header>
                    {filterColumnsRow}
                    <Table.Body>
                        {tableBody}
                    </Table.Body>
                    {tableFooter}
                </Table>
            </>
        )
        //     }
        //     else {

        //         loadBalancerFarmsBuffedTableComponent = (
        //             <div className="centered">
        //                 <Message info icon>
        //                     <Icon name='circle notched' loading />
        //                     <Message.Content>
        //                         <Message.Header>Fetching loadbalancer farms</Message.Header>
        //                     </Message.Content>
        //                 </Message>
        //             </div>
        //         )
        //     }
        // }
        // else {
        //     loadBalancerFarmsBuffedTableComponent = null
        // }


        return (
            <>
                {loadBalancerFarmsBuffedTableComponent}
            </>
        )
    }
}
