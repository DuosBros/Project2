import _ from 'lodash'
import React, { Component } from 'react'
import { Table, Grid, Message, Input, Button, Icon, Label } from 'semantic-ui-react'
import Pagination from 'semantic-ui-react-button-pagination';
import { filterInArrayOfObjects, isNum, debounce } from '../utils/HelperFunction';

const DEFAULT_COLUMN_PROPS = {
    collapsing: false,
    sortable: true,
    searchable: true,
    visibleByDefault: true
}

export default class GenericTable extends Component {

    constructor(props) {
        super(props);

        // generate columns and grouping
        let { columns, grouping } = this.generateColumnsAndGrouping(props);

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
            limit: this.props.defaultLimitOverride ? this.props.defaultLimitOverride : 15,
            limitInput: this.props.defaultLimitOverride ? this.props.defaultLimitOverride.toString() : "15",
            limitInputValid: true,
            multiSearchInput: this.props.multiSearchInput ? this.props.multiSearchInput : "",
            showColumnFilters: false,
            filterInputs,
            filters,
            columns,
            grouping,
            data: this.props.data,
            columnToggle: columns.filter(c => c.visibleByDefault === false).length > 0,
            showColumnToggles: false,
            visibleColumnsList: columns.filter(c => c.visibleByDefault).map(c => c.prop)
        }

        if(Array.isArray(this.state.data)) {
            this.state.data = this.sort(this.state.data, null);
        }

        this.updateFilters = debounce(this.updateFilters, 400);
        this.updateLimit = debounce(this.updateLimit, 400);
    }

    generateColumnsAndGrouping(props) {
        let columns = this.getColumns();

        if(!columns && props.columns) {
            columns = props.columns
        }

        if(!columns) {
            throw new Error("Columns are undefined!");
        }

        columns = columns.map(c => Object.assign({}, DEFAULT_COLUMN_PROPS, c));
        for(let c of columns) {
            if(!c.hasOwnProperty("prop")) {
                throw new Error("Columns need a 'prop' property");
            }
        }

        let grouping = this.getGrouping();
        grouping = grouping.map(gp => {
            let match = columns.filter(c => c.prop === gp);
            if(match.length > 1) {
                throw new Error("Grouping on '" + gp + "' is ambiguous. Mulitple columns with this prop are defined.");
            } else if(match.length < 1) {
                throw new Error("Grouping on '" + gp + "' not possible. Grouping only possible on props that are specified by a column.");
            }
            match[0].sortable = false;
            return match[0];
        });

        return {
            columns,
            grouping
        };
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.data !== nextProps.data) {
            let data = this.sort(nextProps.data, null);
            this.setState({ data });
        }
    }

    handleSort = clickedColumn => () => {
        let { sortColumn, data, sortDirection } = this.state

        if (sortColumn !== clickedColumn) {
            this.setState({
                sortColumn: clickedColumn,
                data: this.sort(data, clickedColumn, 'ascending'),
                sortDirection: 'ascending',
            });

            return;
        }

        sortDirection = sortDirection === 'ascending' ? 'descending' : 'ascending';
        this.setState({
            data: this.sort(data, sortColumn, sortDirection),
            sortDirection
        });
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

    handleStateToggle = (e, {name}) => {
        this.setState({
            [name]: !this.state[name]
        });
    }

    handleColumnToggle = (e, {prop, value}) => {
        const { columns, visibleColumnsList } = this.state;
        let newVisibleValue = !value;

        let newVisibleColumnsList = columns.filter(c => {
            if(c.prop === prop) {
                return newVisibleValue;
            }
            return visibleColumnsList.indexOf(c.prop) !== -1;
        }).map(c => c.prop);

        this.setState({
            visibleColumnsList: newVisibleColumnsList
        });
    }

    handleChangeRecordsPerPage = (e, {value}) => {
        let n = value.trim(),
            limitInputValid = isNum(n);

        this.setState({
            limitInput: value,
            limitInputValid
        });

        if(limitInputValid) {
            this.updateLimit();
        }
    }

    updateLimit() {
        this.setState(prev => {
            let n = prev.limitInput.trim(),
                limitInputValid = isNum(n);

            if(limitInputValid) {
                return { limit: parseInt(n) };
            }
        });
    }

    sort(data, by, direction) {
        data = data.slice();
        data.sort(this.comparatorGrouped.bind(this, direction, by));
        return data
    }

    comparatorGrouped(direction, prop, a, b) {
        let sortFactor = direction === "descending" ? -1 : 1;

        var res;
        for(let g of this.state.grouping) {
            res = this.compareBase(a[g.prop], b[g.prop]);

            if(res !== 0) {
                return res;
            }
        }
        if(prop === null) {
            return res;
        }
        return sortFactor * this.compareBase(a[prop], b[prop]);
    }

    compareBase(a, b) {
        if(typeof a === "number" && typeof b === "number") {
            return a < b ? -1 : (a > b ? 1 : 0);
        }
        return a.toString().localeCompare(b.toString());
    }

    render() {
        const {
            columns,
            grouping,
            visibleColumnsList,
            sortColumn,
            sortDirection,
            multiSearchInput,
            limit,
            limitInput,
            limitInputValid,
            showColumnFilters,
            showColumnToggles,
            columnToggle,
            data,
            filters,
            offset
        } = this.state

        let visibleColumns = columns.filter(c => visibleColumnsList.indexOf(c.prop) !== -1);

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

        var renderData, tableFooter, filteredData,
            filterColumnsRow, toggleColumnsRow,
            columnToggleButton,
            isEdit, isAdd, toAdd, toRemove;

        isEdit = this.props.isEdit;
        isAdd = this.props.isAdd;

        if(isEdit) {
            toAdd = this.props.toAdd;
            toRemove = this.props.toRemove;
        }

        let headerCells = visibleColumns.map(c => {
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
                    key={"c-" + c.prop}
                    content={c.name}
                    {...headerProps}
                />
            );
        });
        if(isEdit) {
            headerCells.push((
                <Table.HeaderCell
                    collapsing={false}
                    width={1}
                    key="action"
                    content="Actions"
                    disabled
                />
            ));
        }

        if (multiSearchInput !== "") {
            filteredData = filterInArrayOfObjects(multiSearchInput, data, visibleColumns.filter(c => c.searchable).map(c => c.prop));
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

        if (filteredData.length > limit) {
            renderData = filteredData.slice(offset, offset + limit)
            tableFooter = (
                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell colSpan='16'>
                            <Pagination
                                compact
                                reduced
                                size="small"
                                floated="right"
                                offset={offset}
                                limit={limit}
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
            let headerFilterCells = visibleColumns.map(c => {
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

        var tableBody = [],
            prevRow = {};
        renderData.map(data => this.transformDataRow(Object.assign({}, data))).forEach(data => {
            let insertGroupingHeader = false;
            for(let gc of grouping) {
                if(data[gc.prop] !== prevRow[gc.prop]) {
                    insertGroupingHeader = true;
                    break;
                }
            }

            if(insertGroupingHeader === true) {
                let groupingHeaderKey = grouping.map(gc => data[gc.prop]),
                    groupingHeaderText = grouping.map(gc => data[gc.display ? gc.display : gc.prop]);
                tableBody.push((
                    <Table.Row key={"group-" + groupingHeaderKey.join('::')}>
                        <Table.HeaderCell style={{ backgroundColor: '#f2f2f2' }} colSpan='11'>{groupingHeaderText.join(', ')}</Table.HeaderCell>
                    </Table.Row>
                ));
            }

            let cells = visibleColumns.map(c => {
                if(c.data === false) {
                    return null;
                }
                if(c.display) {
                    return (<Table.Cell key={c.prop}>{data[c.display]}</Table.Cell>)
                }
                return (<Table.Cell key={c.prop}>{data[c.prop]}</Table.Cell>)
            });

            if(isEdit) {
                let editIcon;
                if(isAdd) {
                    editIcon = toAdd.indexOf(data.Id) > -1 ? (<Icon color="red" corner name='minus' />) : (<Icon color="green" corner name='add' />);
                } else {
                    editIcon = toRemove.indexOf(data.Id) > -1 ? (<Icon color="green" corner name='add' />) : (<Icon color="red" corner name='minus' />);
                }
                let editIconGroup = (
                    <>
                        <Icon name='balance' />
                        {editIcon}
                    </>
                );

                cells.push((
                    <Table.Cell key="a">
                        <Button
                            onClick={isEdit && isAdd ? () => this.props.handleAdd(data.Id) : () => this.props.handleRemove(data.Id)}
                            style={{ padding: '0.3em' }}
                            size='medium'
                            icon={editIconGroup} >
                        </Button>
                    </Table.Cell>
                ));
            }

            tableBody.push((
                <Table.Row positive={isEdit && isAdd === true && toAdd.indexOf(data.Id) > -1}
                    negative={isEdit && isAdd === false && toRemove.indexOf(data.Id) > -1}
                    key={"data-" + data.Id}>
                    {cells}
                </Table.Row>
            ));
            prevRow = data;
        });

        if(columnToggle) {
            columnToggleButton = (
                <div>
                    <Button
                        size="small"
                        name="showColumnToggles"
                        onClick={this.handleStateToggle}
                        compact
                        content={showColumnToggles ? 'Hide Column Toggles' : 'Show Column Toggles'}
                        style={{ padding: '0.3em', marginTop: '0.5em', textAlign: 'right' }}
                        id="secondaryButton"
                        icon={showColumnToggles ? 'eye slash' : 'eye'}
                        labelPosition='right' />
                </div>
            )

            if(showColumnToggles) {
                let columnToggles = columns.map(c => {
                    let visible = visibleColumnsList.indexOf(c.prop) !== -1;
                    return (
                        <Label
                            key={c.prop}
                            color={visible ? "green" : "red"}
                            content={c.name}
                            value={visible}
                            onClick={this.handleColumnToggle}
                            prop={c.prop}/>
                    );
                });
                toggleColumnsRow = (
                    <Grid.Row>
                        <Grid.Column textAlign="right" className="column toggles">
                        {columnToggles}
                        </Grid.Column>
                    </Grid.Row>
                );
            } else {
                toggleColumnsRow = null;
            }
        } else {
            columnToggleButton = null;
            toggleColumnsRow = null;
        }

        return (
            <div className="generic table">
                <Grid>
                    <Grid.Row>
                    <Grid.Column floated='left' width={4}>
                        <Input
                            label='Filter:'
                            id="multiSearchFilterInBuffedTable"
                            fluid
                            value={multiSearchInput} placeholder="Type to search..." name="multiSearchInput" onChange={this.handleMultiFilterChange} ></Input>
                    </Grid.Column>
                    <Grid.Column width={6}/>
                    <Grid.Column floated='right' width={6} textAlign="right">
                        <div style={{ float: "right" }}>
                            <p>Showing {filteredData.length > 0 ? this.state.offset + 1 : 0} to {filteredData.length < limit ? filteredData.length : this.state.offset + limit} of {filteredData.length} entries</p>
                            <div>
                                <Button
                                    size="small"
                                    name="showColumnFilters"
                                    onClick={this.handleStateToggle}
                                    compact
                                    content={showColumnFilters ? 'Hide Column Filters' : 'Show Column Filters'}
                                    style={{ padding: '0.3em', marginTop: '0.5em', textAlign: 'right' }}
                                    id="secondaryButton"
                                    icon={showColumnFilters ? 'eye slash' : 'eye'}
                                    labelPosition='right' />
                            </div>
                            {columnToggleButton}
                            {this.renderCustomFilter()}
                        </div>
                        <div style={{ float: "right", margin: "0 20px" }}>
                            <Input
                                label='Records per page:'
                                className="RecordsPerPage"
                                error={!limitInputValid}
                                value={limitInput}
                                name="inputRecordsPerPage"
                                onChange={this.handleChangeRecordsPerPage} />
                        </div>
                    </Grid.Column>
                    </Grid.Row>
                    {toggleColumnsRow}
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
            </div>
        );
    }

    getGrouping() {
        return [];
    }

    getColumns() {
        return null;
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
