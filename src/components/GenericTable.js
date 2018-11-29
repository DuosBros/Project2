import _ from 'lodash'
import React, { Component } from 'react'
import { Table, Grid, Message, Input, Button, Icon } from 'semantic-ui-react'
import Pagination from 'semantic-ui-react-button-pagination';
import { filterInArrayOfObjects, debounce } from '../utils/HelperFunction';

const DEFAULT_COLUMN_PROPS = {
    collapsing: false,
    sortable: true,
    searchable: true
}

export default class GenericTable extends Component {

    constructor(props) {
        super(props);

        // generate columns
        let columns = this.generateColumns(props);

        // generate empty filters and filterInputs objects
        let filterInputs = {},
            filters = {};
        for(let col in columns) {
            filterInputs[col.prop] = "";
            filters[col.prop] = "";
        }

        this.state = {
            sortColumn: null,
            sortDirection: null,
            offset: 0,
            defaultLimit: 15,
            multiSearchInput: this.props.multiSearchInput ? this.props.multiSearchInput : "",
            showColumnFilters: false,
            filterInputs,
            filters,
            columns,
            data: this.props.data
        }

        this.updateFilters = debounce(this.updateFilters, 400);
    }

    generateColumns(props) {
        let columns = props.columns ? props.columns : this.getColumns();

        if(!columns) {
            throw new Error("Columns are undefined!");
        }

        if(props.isEdit) {
            var isAddedAlready = columns.filter(x => x.name === "Actions");
            if(isAddedAlready.length === 0) {
                columns = columns.slice();
                columns.push({
                    name: "Actions",
                    prop: "a",
                    width: 1,
                    sortable: false,
                    data: false,
                    searchable: false
                });
            }
        }
        columns = columns.map(c => Object.assign({}, DEFAULT_COLUMN_PROPS, c));
        return columns;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.data });
    }

    handleSort = clickedColumn => () => {
        const { sortColumn, data, sortDirection } = this.state

        if (sortColumn !== clickedColumn) {
            this.setState({
                sortColumn: clickedColumn,
                data: _.sortBy(data, [element => typeof element[clickedColumn] === "string" ? element[clickedColumn].toLowerCase() : element[clickedColumn]]),
                sortDirection: 'ascending',
            })

            return
        }

        this.setState({
            data: data.reverse(),
            sortDirection: sortDirection === 'ascending' ? 'descending' : 'ascending',
        })
    }

    handleClick(offset) {
        this.setState({ offset });
    }

    handleColumnFilterChange = (e, { name, value }) => {
        let filterInputs = Object.assign({}, this.state.filterInputs, { [name]: value })
        this.setState({ filterInputs });
        this.updateFilters();
    }

    updateFilters = () => {
        this.setState((prev) => ({ filters: prev.filterInputs }));
    }

    handleMultiFilterChange = (e, { name, value }) => {
        this.setState({ multiSearchInput: value });
    }

    handleToggleColumnFilters = () => {
        this.setState({
            showColumnFilters: !this.state.showColumnFilters
        });
    }

    handleChangeRecordsPerPage = (e, {value}) => {
        let n = parseInt(value);
        if(!isNaN(n)) {
            this.setState({ defaultLimit: n });
        }
    }

    render() {
        const { sortColumn, sortDirection, multiSearchInput, defaultLimit,
            showColumnFilters, data, filters, offset } = this.state

        if(!Array.isArray(data)) {
            let msg = this.props.placeholder ? this.props.placeholder : "Fetching data...";
            return (
                <div className="centered">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>{msg}</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            );
        }

        var renderData, tableFooter, filteredData, filterColumnsRow, isEdit, isAdd, toAdd, toRemove;

        isEdit = this.props.isEdit;
        isAdd = this.props.isAdd;

        if(isEdit) {
            toAdd = this.props.toAdd;
            toRemove = this.props.toRemove;
        }

        let headerCells = this.state.columns.map(c => {
            let headerProps;
            if(c.sortable) {
                headerProps = {
                    sorted: sortColumn === c.prop ? sortDirection : null,
                    onClick: this.handleSort(c.prop)
                };
            } else {
                headerProps = {
                    disabled: true
                };
            }
            return (
                <Table.HeaderCell
                    collapsing={c.collapsing}
                    width={c.collapsing ? null : c.width}
                    key={c.prop}
                    content={c.name}
                    {...headerProps}
                />
            );
        });

        if (multiSearchInput !== "") {
            filteredData = filterInArrayOfObjects(multiSearchInput, data, this.state.columns.filter(c => c.searchable).map(c => c.prop));
        } else {
            filteredData = data;
        }

        filteredData = this.applyCustomFilter(filteredData);

        if(showColumnFilters) {
            for(let col of Object.getOwnPropertyNames(filters)) {
                if(!_.isEmpty(filters[col])) {
                    filteredData = filteredData.filter(data => {
                        if(data[col]) {
                            return data[col].toString().search(new RegExp(filters[col], "i")) >= 0
                        }
                        return false;
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
            let headerFilterCells = this.state.columns.map(c => {
                let filterInput = null;
                if(c.searchable) {
                    filterInput = (<Input fluid name={c.prop} onChange={this.handleColumnFilterChange} value={this.state.filterInputs[c.prop]} />)
                }
                return (
                    <Table.HeaderCell collapsing={c.collapsing} width={c.collapsing ? null : c.width} key={c.prop}>
                        {filterInput}
                    </Table.HeaderCell>
                );
            })
            filterColumnsRow = (
                <Table.Header>
                    <Table.Row>{headerFilterCells}</Table.Row>
                </Table.Header>
            )
        }
        else {
            filterColumnsRow = null
        }

        var tableBody = renderData.map(data => this.transformDataRow(Object.assign({}, data))).map(data => {
            let cells = this.state.columns.map(c => {
                if(c.data === false) {
                    return null;
                }
                if(c.display) {
                    return (<Table.Cell key={c.prop}>{data[c.display]}</Table.Cell>)
                }
                return (<Table.Cell key={c.prop}>{data[c.prop]}</Table.Cell>)
            });

            if(isEdit) {
                cells.push((
                    <Table.Cell key="a">
                        <Button onClick={isEdit && isAdd ? () => this.props.handleAdd(data.Id) : () => this.props.handleRemove(data.Id)} style={{ padding: '0.3em' }} size='medium'
                            icon={
                                <>
                                    <Icon name='balance' />
                                    {
                                        isAdd ? (
                                            toAdd.indexOf(data.Id) > -1 ? (<Icon color="red" corner name='minus' />) : (<Icon color="green" corner name='add' />)
                                        ) : (
                                            toRemove.indexOf(data.Id) > -1 ? (<Icon color="green" corner name='add' />) : (<Icon color="red" corner name='minus' />)
                                        )
                                    }
                                </>
                            } >
                        </Button>
                    </Table.Cell>
                ));
            }

            return (
                <Table.Row positive={isEdit && isAdd === true && toAdd.indexOf(data.Id) > -1}
                    negative={isEdit && isAdd === false && toRemove.indexOf(data.Id) > -1}
                    key={data.Id}>
                    {cells}
                </Table.Row>
            );
        });

        return (
            <>
                <Grid>
                    <Grid.Column floated='left' width={4}>
                        <Input
                            label='Filter:'
                            id="multiSearchFilterInBuffedTable"
                            fluid
                            value={multiSearchInput} placeholder="Type to search..." name="multiSearchInput" onChange={this.handleMultiFilterChange} ></Input>
                    </Grid.Column>
                    <Grid.Column width={8}/>
                    <Grid.Column width={2}>
                        <Input
                            label='Records per page:'
                            id="inputRecordsPerPage"
                            fluid
                            size="tiny"
                            value={defaultLimit} name="inputRecordsPerPage" onChange={this.handleChangeRecordsPerPage} ></Input>
                    </Grid.Column>
                    <Grid.Column floated='right' width={2} textAlign="right">
                        Showing {filteredData.length > 0 ? this.state.offset + 1 : 0} to {filteredData.length < defaultLimit ? filteredData.length : this.state.offset + defaultLimit} of {filteredData.length} entries
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
                        {this.renderCustomFilter()}
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
        );
    }

    transformDataRow(data) {
        return data;
    }

    renderCustomFilter() {
        return null;
    }

    applyCustomFilter(filteredData) {
        return filteredData;
    }
}
