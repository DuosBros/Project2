import _ from 'lodash'
import React, { Component } from 'react'
import { Table, Grid, Input, Button, Icon, Message } from 'semantic-ui-react'
import Pagination from 'semantic-ui-react-button-pagination';
import { filterInArrayOfObjects, debounce } from '../utils/HelperFunction';


export default class PatchGroupsBuffedTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            column: null,
            direction: null,
            showAll: false,
            offset: 0,
            defaultLimit: 45,
            multiSearchInput: this.props.multiSearchInput ? this.props.multiSearchInput : "",
            showColumnFilters: false,
            filterInputs: {
                Id: "",
                Name: "",
                ADPATH: "",
                Country: "",
                Stage: "",
                MemberOfGroup: "",
                ServerCount: "",
            },
            filters: {
                Id: "",
                Name: "",
                ADPATH: "",
                Country: "",
                Stage: "",
                MemberOfGroup: "",
                ServerCount: "",
            },
            data: this.props.data,
            showBETAPools: false,
            COLUMNS: [
                {
                    name: "Id",
                    prop: "Id",
                    width: 1,
                    collapsing: false
                },
                {
                    name: "Name",
                    prop: "Name",
                    width: 4,
                    collapsing: true
                },
                {
                    name: "ADPath",
                    prop: "ADPATH",
                    width: 4,
                    collapsing: true
                },
                {
                    name: "Country",
                    prop: "Country",
                    width: 1,
                    collapsing: false
                },
                {
                    name: "Stage",
                    prop: "Stage",
                    width: 2,
                    collapsing: false
                },
                {
                    name: "MainPatchGroup",
                    prop: "MemberOfGroup",
                    width: 3,
                    collapsing: false
                },
                {
                    name: "# Servers",
                    prop: "ServerCount",
                    width: 1,
                    collapsing: true
                }
            ]
        }

        this.updateFilters = debounce(this.updateFilters, 400);
        // this.handleChangeMultisearch = debounce(this.handleChangeMultisearch, 400);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.data });
    }

    handleSort = clickedColumn => () => {
        const { column, data, direction } = this.state

        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                data: _.sortBy(data, [element => typeof element[clickedColumn] === "string" ? element[clickedColumn].toLowerCase() : element[clickedColumn]]),
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

    handleChangeRecordsPerPage = (e, {value}) => {
        this.setState({ defaultLimit: value });
    }

    render() {

        const { column, direction, multiSearchInput, defaultLimit,
            showColumnFilters, data, filters, offset, showBETAPools } = this.state

        var renderData, tableFooter, filteredData, filterColumnsRow, patchGroupsBuffedTableComponent;

        let headerCells = this.state.COLUMNS.map(c => (
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
                        ADPATH: pic.ADPATH,
                        Country: pic.Country,
                        Stage: pic.Stage,
                        MemberOfGroup: pic.MemberOfGroup,
                        ServerCount: pic.ServerCount
                    }
                )
            })

            filteredData = filterInArrayOfObjects(multiSearchInput, mappedData)
        }
        else {
            filteredData = data
        }

        if (showColumnFilters) {
            for (let col of Object.getOwnPropertyNames(filters)) {
                if (!_.isEmpty(filters[col])) {
                    filteredData = filteredData.filter(data => {
                        if (data[col]) {
                            return data[col].toString().search(new RegExp(filters[col], "i")) >= 0
                        }
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
            let headerFilterCells = this.state.COLUMNS.map(c => (
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
            <Table.Row key={data.Id}>
                <Table.Cell>{data.Id}</Table.Cell>
                <Table.Cell>{data.Name}</Table.Cell>
                <Table.Cell>{data.ADPATH}</Table.Cell>
                <Table.Cell>{data.Country}</Table.Cell>
                <Table.Cell>{data.Stage}</Table.Cell>
                <Table.Cell>{data.MemberOfGroup}</Table.Cell>
                <Table.Cell>{data.ServerCount}</Table.Cell>
            </Table.Row>
        ))

        if (data.length !== 0) {
            patchGroupsBuffedTableComponent = (
                <>
                    <Grid>
                        <Grid.Column floated='left' width={4}>
                            <Input
                                label='filter:'
                                id="multiSearchFilterInBuffedTable"
                                fluid
                                value={multiSearchInput} placeholder="Type to search..." name="multiSearchInput" onChange={this.handleChangeMultisearch} ></Input>
                        </Grid.Column>
                        <Grid.Column width={8} >

                        </Grid.Column>
                        <Grid.Column width={2} >
                            <Input
                                label='Records per page:'
                                id="inputRecordsPerPage"
                                fluid
                                value={defaultLimit} name="inputRecordsPerPage" onChange={this.handleChangeRecordsPerPage} ></Input>
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
        }
        else {

            patchGroupsBuffedTableComponent = (
                <div className="centered">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching patch groups</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            )
        }



        return (
            <>
                {patchGroupsBuffedTableComponent}
            </>
        )
    }
}
