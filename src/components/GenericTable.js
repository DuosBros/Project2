import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Table, Grid, Message, Input, Button, Icon, Label, Popup, Dropdown } from 'semantic-ui-react'
import Pagination from 'semantic-ui-react-button-pagination';
import ExportFromJSON from 'export-from-json'
import { filterInArrayOfObjects, isNum, debounce, pick } from '../utils/HelperFunction';

const DEFAULT_COLUMN_PROPS = {
    collapsing: false,
    sortable: true,
    searchable: true,
    visibleByDefault: true,
    exportableByDefault: true
}

export const GenericTablePropTypes = {
    defaultLimitOverride: PropTypes.number,
    showTableHeaderFunctions: PropTypes.bool,
    showTableHeader: PropTypes.bool,
    disableGrouping: PropTypes.bool,
    compact: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ])
};

export default class GenericTable extends Component {
    static defaultProps = {
        defaultLimitOverride: 15,
        showTableHeaderFunctions: true,
        showTableHeader: true,
        disableGrouping: false,
        compact: false
    }

    static propTypes = GenericTablePropTypes

    constructor(props) {
        super(props);

        // generate columns and grouping
        let { columns, grouping } = this.generateColumnsAndGrouping(props);

        // generate empty filters and filterInputs objects
        let filterInputs = {},
            filters = {};
        for (let col of columns) {
            filterInputs[col.prop] = "";
            filters[col.prop] = "";
        }

        let defaultLimit = parseInt(this.props.defaultLimitOverride);

        this.state = {
            sortColumn: null,
            sortDirection: null,
            offset: 0,
            showTableHeaderFunctions: this.props.showTableHeaderFunctions,
            showTableHeader: this.props.showTableHeader,
            defaultLimit,
            limit: defaultLimit,
            limitInput: defaultLimit.toString(),
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
            visibleColumnsList: columns.filter(c => c.visibleByDefault).map(c => c.prop),
            exportableColumnsList: columns.filter(c => c.exportableByDefault).map(c => c.prop),
            expandedRows: []
        }

        if (Array.isArray(this.state.data)) {
            this.state.data = this.sort(this.state.data, null);
        }

        this.updateFilters = debounce(this.updateFilters, 400);
        this.updateLimit = debounce(this.updateLimit, 400);
    }

    generateColumnsAndGrouping(props) {
        let columns = this.getColumns();

        if (!columns && props.columns) {
            columns = props.columns
        }

        if (!columns) {
            throw new Error("Columns are undefined!");
        }

        columns = columns.map(c => Object.assign({}, DEFAULT_COLUMN_PROPS, c));
        for (let c of columns) {
            if (!c.hasOwnProperty("prop")) {
                throw new Error("Columns need a 'prop' property");
            }
        }

        let grouping = props.disableGrouping ? [] : this.getGrouping();
        grouping = grouping.map(gp => {
            let match = columns.filter(c => c.prop === gp);
            if (match.length > 1) {
                throw new Error("Grouping on '" + gp + "' is ambiguous. Mulitple columns with this prop are defined.");
            } else if (match.length < 1) {
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
        if (this.props.data !== nextProps.data) {
            let data;
            if (nextProps.data !== null && Array.isArray(nextProps.data)) {
                data = this.sort(nextProps.data, null);
            }

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
                expandedRows: []
            });

            return;
        }

        sortDirection = sortDirection === 'ascending' ? 'descending' : 'ascending';
        this.setState({
            data: this.sort(data, sortColumn, sortDirection),
            sortDirection,
            expandedRows: []
        });
    }

    handlePaginationChange(offset) {
        this.setState({
            offset,
            expandedRows: []
        });
    }

    handleColumnFilterChange = (e, { name, value }) => {
        let filterInputs = Object.assign({}, this.state.filterInputs, { [name]: value })
        this.setState({ filterInputs });
        this.updateFilters();
    }

    updateFilters = () => {
        this.setState((prev) => ({ filters: prev.filterInputs }));
    }

    handleMultiFilterChange = (e, { value }) => {
        this.setState({ multiSearchInput: value });
    }

    handleToggleColumnFilters = () => {
        this.setState({
            showColumnFilters: !this.state.showColumnFilters
        });
    }

    handleStateToggle = (e, { name }) => {
        this.setState({
            [name]: !this.state[name]
        });
    }

    handleColumnToggle = (e, { prop, value }) => {
        const { columns, visibleColumnsList } = this.state;
        let newVisibleValue = !value;

        let newVisibleColumnsList = columns.filter(c => {
            if (c.prop === prop) {
                return newVisibleValue;
            }
            return visibleColumnsList.indexOf(c.prop) !== -1;
        }).map(c => c.prop);

        this.setState({
            visibleColumnsList: newVisibleColumnsList
        });
    }

    handleChangeRecordsPerPage = (e, { value }) => {
        let n = value.trim(),
            limitInputValid = isNum(n);

        this.setState({
            limitInput: value,
            limitInputValid
        });

        if (limitInputValid) {
            this.updateLimit();
        }
    }

    updateLimit() {
        this.setState(prev => {
            let n = prev.limitInput.trim(),
                limitInputValid = isNum(n);

            if (limitInputValid) {
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
        for (let g of this.state.grouping) {
            res = this.compareBase(a[g.prop], b[g.prop]);

            if (res !== 0) {
                return res;
            }
        }
        if (prop === null) {
            return res;
        }
        return sortFactor * this.compareBase(a[prop], b[prop]);
    }

    compareBase(a, b) {
        if (a === null) {
            return b === null ? 0 : -1;
        } else if (b === null) {
            return 1;
        }
        if (typeof a === "number" && typeof b === "number") {
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            }
            return 0;
        }
        return a.toString().localeCompare(b.toString());
    }

    handleJSONExport = (data, type) => {
        if (type === "txt" || type === "json") {
            const fileName = new Date().toISOString() + "." + type

            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";

            var json = JSON.stringify(data),
                blob = new Blob([json], { type: "octet/stream" }),
                url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        }
        else {
            const fileName = new Date().toISOString()

            ExportFromJSON({ data: data, fileName: fileName, exportType: type })
        }
    }

    onExpandToggle = (e, { rowkey, rowdata }) => {
        this.setState(function(prev) {
            if(prev.expandedRows.indexOf(rowkey) === -1) {
                this.onRowExpandToggle(true, rowkey, rowdata);
                return { expandedRows: [...prev.expandedRows, rowkey] };
            } else {
                this.onRowExpandToggle(false, rowkey, rowdata);
                return { expandedRows: prev.expandedRows.filter(e => e !== rowkey) }
            }
        });
    }

    render() {
        const {
            columns,
            grouping,
            visibleColumnsList,
            exportableColumnsList,
            sortColumn,
            sortDirection,
            multiSearchInput,
            defaultLimit,
            limit,
            limitInput,
            limitInputValid,
            showColumnFilters,
            showColumnToggles,
            columnToggle,
            data,
            filters,
            offset,
            showTableHeaderFunctions,
            showTableHeader,
            expandedRows
        } = this.state;

        const {
            compact
        } = this.props;

        const expandable = this.isExpandable();

        let visibleColumns = columns.filter(c => visibleColumnsList.indexOf(c.prop) !== -1);

        if (!Array.isArray(data)) {
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

        if (this.props.data.length < 1) {
            return null;
        }

        let exportableColumns = columns.filter(c => exportableColumnsList.indexOf(c.prop) !== -1);

        // not exporting columns like Links (which contains buttons)
        let columnsToExport = visibleColumns.filter(x => exportableColumns.includes(x)).map(x => { return { label: x.name, key: x.prop } });
        let dataToExport = pick(data, columnsToExport.map(x => x.key))
        var renderData, tableFooter, filteredData,
            filterColumnsRow, toggleColumnsRow,
            columnToggleButton,
            isEdit, isAdd, toAdd, toRemove;

        isEdit = this.props.isEdit;
        isAdd = this.props.isAdd;

        if (isEdit) {
            toAdd = this.props.toAdd;
            toRemove = this.props.toRemove;
        }

        let headerCells = visibleColumns.map(c => {
            let headerProps;
            if (c.sortable) {
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
        if (isEdit) {
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

        if (showColumnFilters) {
            var filterValid = [];
            for (let col of Object.getOwnPropertyNames(filters)) {
                try {
                    if (!_.isEmpty(filters[col])) {
                        filteredData = filteredData.filter(data => {
                            if (data[col]) {
                                return data[col].toString().search(new RegExp(filters[col], "i")) >= 0
                            }
                            return false;
                        })
                    }
                    filterValid[col] = true;
                } catch (e) {
                    filterValid[col] = false;
                }
            }
        }

        if (defaultLimit && filteredData.length > limit) {
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
                                onClick={(e, props, o) => this.handlePaginationChange(o)}
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
                if (c.searchable) {
                    filterInput = (<Input fluid name={c.prop} onChange={this.handleColumnFilterChange} value={this.state.filterInputs[c.prop]} error={!filterValid[c.prop]} />)
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
            let rowKey = this.getDataKey(data);
            // check whether grouping header should be inserted
            let insertGroupingHeader = false;
            for (let gc of grouping) {
                if (data[gc.prop] !== prevRow[gc.prop]) {
                    insertGroupingHeader = true;
                    break;
                }
            }

            // insert grouping header if needed
            if (insertGroupingHeader === true) {
                let groupingHeaderKey = grouping.map(gc => data[gc.prop]),
                    groupingHeaderText = grouping.map(gc => data[gc.display ? gc.display : gc.prop]);
                tableBody.push((
                    <Table.Row key={"group-" + groupingHeaderKey.join('::')}>
                        <Table.HeaderCell style={{ backgroundColor: '#f2f2f2' }} colSpan='11'>{groupingHeaderText.join(', ')}</Table.HeaderCell>
                    </Table.Row>
                ));
            }

            let isRowExpanded = expandable === true && expandedRows.indexOf(rowKey) !== -1;

            // create table cells from row data
            let cells = visibleColumns.map((c, i) => {
                let expandButton = null;
                let cellData;
                if (c.data === false) {
                    return null;
                }
                if (c.display) {
                    cellData = data[c.display];
                } else {
                    cellData = data[c.prop];
                }
                if (expandable === true && i === 0) {
                    let expandName = isRowExpanded ? "minus" : "plus";
                    expandButton = (<Icon link rowkey={rowKey} rowdata={data} name={expandName + " square outline"} onClick={this.onExpandToggle}/>);
                }
                return (<Table.Cell style={data[c.styleProp] ? data[c.styleProp] : null} key={c.prop}>{expandButton}{cellData}</Table.Cell>)
            });

            // add cell for add/remove buttons if enabled
            if (isEdit) {
                let editIcon;
                if (isAdd) {
                    editIcon = toAdd.map(x => x.Id).indexOf(data.Id) > -1 ? (<Icon color="red" corner name='minus' />) : (<Icon color="green" corner name='add' />);
                } else {
                    editIcon = toRemove.map(x => x.Id).indexOf(data.Id) > -1 ? (<Icon color="green" corner name='add' />) : (<Icon color="red" corner name='minus' />);
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
                            onClick={isEdit && isAdd ? () => this.props.handleAdd(data) : () => this.props.handleRemove(data)}
                            style={{ padding: '0.3em' }}
                            size='medium'
                            icon={editIconGroup} >
                        </Button>
                    </Table.Cell>
                ));
            }

            // build row from cells
            tableBody.push((
                <Table.Row positive={isEdit && isAdd === true && toAdd.map(x => x.Id).indexOf(data.Id) > -1}
                    negative={isEdit && isAdd === false && toRemove.map(x => x.Id).indexOf(data.Id) > -1}
                    key={'data' + rowKey}>
                    {cells}
                </Table.Row>
            ));

            // insert details-row if row is in expanded state
            if(isRowExpanded) {
                tableBody.push((
                    <Table.Row key={'expanded' + rowKey}>
                        <Table.Cell colSpan={visibleColumns.length}>{this.renderExpandedRow(rowKey, data)}</Table.Cell>
                    </Table.Row>
                ));
            }

            // important for drawing grouping headers
            prevRow = data;
        });

        if (columnToggle) {
            columnToggleButton = (
                <div>
                    <Button
                        size="small"
                        name="showColumnToggles"
                        onClick={this.handleStateToggle}
                        compact
                        content={showColumnToggles ? 'Hide Column Toggles' : 'Show Column Toggles'}
                        style={{ padding: '0.3em', marginTop: '0.5em', textAlign: 'right' }}
                        icon={showColumnToggles ? 'eye slash' : 'eye'}
                        labelPosition='right' />
                </div>
            )

            if (showColumnToggles) {
                let columnToggles = columns.map(c => {
                    let visible = visibleColumnsList.indexOf(c.prop) !== -1;
                    return (
                        <Label
                            key={c.prop}
                            color={visible ? "green" : "red"}
                            content={c.name}
                            value={visible}
                            onClick={this.handleColumnToggle}
                            prop={c.prop} />
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
        var tableFunctionsGrid;
        if (showTableHeader) {
            if (showTableHeaderFunctions) {
                tableFunctionsGrid = (
                    <Grid>
                        <Grid.Row>
                            <Grid.Column floated='left' width={4}>
                                <Input
                                    label='Filter:'
                                    id="multiSearchFilterInBuffedTable"
                                    fluid
                                    value={multiSearchInput} placeholder="Type to search..." name="multiSearchInput" onChange={this.handleMultiFilterChange} ></Input>
                            </Grid.Column>
                            <Grid.Column width={1}>
                                <Dropdown icon={<Icon className="iconMargin" name='share' />} item text='Export'>
                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            onClick={() => this.handleJSONExport(dataToExport, ExportFromJSON.types.txt)}
                                            icon={<Icon name='file text outline' />}
                                            text='Export to TXT' />
                                        <Dropdown.Item
                                            onClick={() => this.handleJSONExport(dataToExport, ExportFromJSON.types.json)}
                                            icon={<Icon name='file text outline' />}
                                            text='Export to JSON' />
                                        <Dropdown.Item
                                            onClick={() => this.handleJSONExport(dataToExport, ExportFromJSON.types.csv)}
                                            icon={<Icon name='file text outline' />}
                                            text='Export to CSV' />
                                        <Dropdown.Item
                                            onClick={() => this.handleJSONExport(dataToExport, ExportFromJSON.types.xls)}
                                            icon={<Icon name='file excel' />}
                                            text='Export to XLS' />
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <div style={{ float: "right", margin: "0 20px", display: defaultLimit === 0 ? "none" : "visible" }}>
                                    <span>Showing {filteredData.length > 0 ? this.state.offset + 1 : 0} to {filteredData.length < limit ? filteredData.length : this.state.offset + limit} of {filteredData.length} entries</span>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <div style={{ float: "left", margin: "0 20px", display: defaultLimit === 0 ? "none" : "visible" }}>
                                    <Input
                                        label='Records per page:'
                                        className="RecordsPerPage"
                                        error={!limitInputValid}
                                        value={limitInput}
                                        name="inputRecordsPerPage"
                                        onChange={this.handleChangeRecordsPerPage} />
                                </div>
                            </Grid.Column>
                            <Grid.Column floated='right' width={4} textAlign="right">
                                <>
                                    <Button
                                        size="small"
                                        className="showColumnFilters"
                                        name="showColumnFilters"
                                        onClick={this.handleStateToggle}
                                        compact
                                        content={showColumnFilters ? 'Hide Column Filters' : 'Show Column Filters'}
                                        style={{ padding: '0.3em', textAlign: 'right' }}
                                        icon={showColumnFilters ? 'eye slash' : 'eye'}
                                        labelPosition='right' />
                                    {columnToggleButton}
                                    {this.renderCustomFilter()}
                                </>

                            </Grid.Column>
                        </Grid.Row>
                        {toggleColumnsRow}
                    </Grid>
                )
            }
            else {
                tableFunctionsGrid = (
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Popup trigger={
                                    <Button compact onClick={() => this.setState({ showTableHeaderFunctions: !showTableHeaderFunctions })} icon floated="right">
                                        <Icon name="setting"></Icon>
                                    </Button>
                                } content='Show table settings' inverted />

                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                )
            }
        }
        else {
            tableFunctionsGrid = null
        }

        return (
            <>
                {tableFunctionsGrid}
                < div className="generic table" >
                    <Table compact={compact} selectable sortable celled basic='very'>
                        <Table.Header>
                            <Table.Row>{headerCells}</Table.Row>
                        </Table.Header>
                        {filterColumnsRow}
                        <Table.Body>
                            {tableBody}
                        </Table.Body>
                        {tableFooter}
                    </Table>
                </div >
            </>
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

    isExpandable() {
        return false;
    }

    onRowExpandToggle(visible, rowKey, rowData) {
        return;
    }

    renderExpandedRow(rowKey, rowData) {
        return null;
    }

    applyCustomFilter(filteredData) {
        return filteredData;
    }

    getDataKey(data) {
        return data.Id
    }
}
