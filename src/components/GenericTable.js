import React, { Component } from 'react'
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Table, Grid, Message, Input, Button, Icon, Label, Popup, Dropdown } from 'semantic-ui-react'
import Pagination from 'semantic-ui-react-button-pagination';
import ExportFromJSON from 'export-from-json'
import { filterInArrayOfObjects, isNum, debounce, pick } from '../utils/HelperFunction';
import { getExcelFile } from '../requests/MiscAxios';

const DEFAULT_COLUMN_PROPS = {
    collapsing: false,
    sortable: true,
    searchable: true,
    visibleByDefault: true,
    exportable: true
}

export default class GenericTable extends Component {
    static propTypes = {
        columns: PropTypes.arrayOf(PropTypes.shape({
            prop: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            collapsing: PropTypes.bool,
            exportable: PropTypes.bool,
            searchable: PropTypes.oneOfType([
                PropTypes.bool,
                PropTypes.oneOf(["distinct"])
            ]),
            sortable: PropTypes.bool,
            visibleByDefault: PropTypes.bool,
        })).isRequired,
        compact: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.oneOf(['very'])
        ]),
        customFilterCallback: PropTypes.func,
        disableGrouping: PropTypes.bool,
        expandable: PropTypes.bool,
        getDataKey: PropTypes.func,
        grouping: PropTypes.array,
        multiSearchInput: PropTypes.string,
        onRowExpandToggle: PropTypes.func,
        renderCustomFilter: PropTypes.func,
        renderExpandedRow: PropTypes.func,
        rowsPerPage: n => Number.isInteger(n) && n >= 0,
        tableHeader: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.oneOf(["hidden"])
        ]),
        transformDataRow: PropTypes.func,
    }

    static defaultProps = {
        compact: false,
        customFilterCallback: GenericTable.customFilterCallback,
        disableGrouping: false,
        expandable: false,
        getDataKey: GenericTable.getDataKey,
        grouping: [],
        multiSearchInput: "",
        onRowExpandToggle: GenericTable.onRowExpandToggle,
        renderCustomFilter: GenericTable.renderCustomFilter,
        renderExpandedRow: GenericTable.renderExpandedRow,
        rowsPerPage: 15,
        tableHeader: true,
    }

    constructor(props) {
        super(props);

        // generate columns and grouping
        let { columns, grouping } = this.generateColumnsAndGrouping(props);

        // generate empty filters and filterInputs objects
        let filterInputs = {},
            filterInputsChanged = {},
            filterInputsValid = {},
            filters = {};
        for (let col of columns.filter(c => c.searchable !== false)) {
            filterInputs[col.prop] = col.searchable === true ? "" : -1;
            filterInputsChanged[col.prop] = false;
            filterInputsValid[col.prop] = true;
            filters[col.prop] = null;
        }

        let multiSearch = this.multiSearchFilterFromInput(props.multiSearchInput);
        let columnDistinctValues = this.generateDistinctValues(columns, props.data, props.distinctValues);

        this.state = {
            columnDistinctValues,
            columns,
            columnToggle: columns.filter(c => c.visibleByDefault === false).length > 0,
            data: props.data,
            expandedRows: [],
            filterInputs,
            filterInputsChanged,
            filterInputsValid,
            filters,
            grouping,
            limit: parseInt(props.rowsPerPage),
            limitInput: props.rowsPerPage.toString(),
            limitInputValid: true,
            multiSearchInput: props.multiSearchInput,
            ...multiSearch,
            offset: 0,
            showColumnFilters: false,
            showColumnToggles: false,
            showTableHeader: props.tableHeader,
            sortColumn: null,
            sortDirection: null,
            visibleColumnsList: columns.filter(c => c.visibleByDefault).map(c => c.prop),
        }

        if (Array.isArray(this.state.data)) {
            this.state.data = this.sort(this.state.data, null);
        }

        this.updateMultiFilter = debounce(this.updateMultiFilter, 400);
        this.updateColumnFilters = debounce(this.updateColumnFiltersImmediate, 400);
        this.updateLimit = debounce(this.updateLimit, 400);
    }

    generateColumnsAndGrouping(props) {
        let columns = props.columns;

        if (!columns) {
            throw new Error("Columns are undefined!");
        }

        columns = columns.map(c => Object.assign({}, DEFAULT_COLUMN_PROPS, c));
        for (let c of columns) {
            if (!c.hasOwnProperty("prop")) {
                throw new Error("Columns need a 'prop' property");
            }
        }

        let grouping = props.disableGrouping ? [] : props.grouping;
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

    generateDistinctValues(columns, data, fromProps) {
        const unfilteredOption = { key: -1, text: (<em>unfiltered</em>), value: -1 };
        const optionMapper = (e, i) => ({ key: i, text: e, value: i });
        let columnDistinctValues = {};

        for (let c of columns.filter(e => e.searchable === "distinct")) {
            let values;
            if (Array.isArray(fromProps[c.prop])) {
                values = fromProps[c.prop].map(optionMapper);
            } else {
                values = data.map(e => e[c.prop])
                    .filter(e =>
                        e !== undefined &&
                        e !== null)
                    .map(e => e.toString());

                values = _.uniq(values).sort().map(optionMapper);
            }
            values.unshift(unfilteredOption);
            columnDistinctValues[c.prop] = values;
        }
        return columnDistinctValues;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.data !== nextProps.data) {
            let data;
            if (nextProps.data !== null && Array.isArray(nextProps.data)) {
                data = this.sort(nextProps.data, null);
            }

            let columnDistinctValues = this.generateDistinctValues(this.state.columns, data, nextProps.distinctValues)
            this.setState({ data, columnDistinctValues });
        } else if (this.props.distictValues !== nextProps.distictValues) { // else if, so we don't generate distinct values twice
            let columnDistinctValues = this.generateDistinctValues(this.state.columns, this.state.data, nextProps.distinctValues)
            this.setState({ columnDistinctValues });
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

    handlePaginationChange = (e, props, offset) => {
        this.setState({
            offset,
            expandedRows: []
        });
    }

    handleColumnFilterChange = (e, { name, value }) => {
        this.setState(prev => {
            let filterInputs = Object.assign({}, prev.filterInputs, { [name]: value }),
                filterInputsChanged = Object.assign({}, prev.filterInputsChanged, { [name]: true });

            return {
                filterInputs,
                filterInputsChanged
            };
        });
        this.updateColumnFilters();
    }

    handleColumnFilterDropdown = (e, { name, value }) => {
        this.setState(prev => {
            let filterInputs = Object.assign({}, prev.filterInputs, { [name]: value }),
                filterInputsChanged = Object.assign({}, prev.filterInputsChanged, { [name]: true });

            return {
                filterInputs,
                filterInputsChanged
            };
        });
        this.updateColumnFilters();
    }

    updateColumnFiltersImmediate() {
        this.setState((prev) => {
            let filters = Object.assign({}, prev.filters),
                filterInputsChanged = Object.assign({}, prev.filterInputsChanged),
                filterInputsValid = Object.assign({}, prev.filterInputsValid);

            for (let key of Object.getOwnPropertyNames(prev.filters).filter(c => prev.filterInputsChanged[c])) {
                let func = null,
                    valid = false;

                try {
                    func = this.buildColumnFilter(key, prev.filterInputs[key]);
                    valid = true;
                } catch (e) {
                    // ignore errors, valid will be false anyway
                }

                filterInputsChanged[key] = false;
                filterInputsValid[key] = valid;
                filters[key] = func;
            }
            return {
                filters,
                filterInputsChanged,
                filterInputsValid
            };
        });
    }

    buildColumnFilter(key, needle) {
        if (typeof needle === "number") {
            // TODO find cleaner solution
            if (needle === -1) {
                return null;
            }
            return heystack => (
                heystack[key] !== undefined &&
                heystack[key] !== null &&
                heystack[key].toString() === this.state.columnDistinctValues[key][needle + 1].text.toString()
            );
        }
        let func = this.buildFilter(needle);
        if (func == null) {
            return func;
        }
        return heystack => (
            heystack[key] !== undefined &&
            heystack[key] !== null &&
            func(heystack[key])
        );
    }

    buildFilter(needle) {
        if (needle.length > 0 && needle.substr(0, 1) === "~") {
            if (needle.length === 1) {
                return null;
            }
            let re = new RegExp(needle.substr(1), "i");
            return heystack => heystack.toString().search(re) >= 0;
        }
        let n = needle.trim().toLowerCase();
        if (n.length === 0) {
            return null;
        }
        return heystack => heystack.toString().toLowerCase().indexOf(n) >= 0;
    }

    handleMultiFilterChange = (e, { value }) => {
        this.setState({ multiSearchInput: value });
        this.updateMultiFilter();
    }

    multiSearchFilterFromInput(input) {
        let func = null,
            valid = false;

        try {
            func = this.buildFilter(input);
            valid = true;
        } catch (e) {
            // ignore errors, valid will be false anyway
        }

        return {
            multiSearch: func,
            multiSearchInputValid: valid
        }
    }

    updateMultiFilter() {
        this.setState((prev) => this.multiSearchFilterFromInput(prev.multiSearchInput));
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
            limitInputValid = isNum(n) && n > 0;

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
                limitInputValid = isNum(n) && n > 0;

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

    handleExport = async (e, { value: type }) => {
        const { data, columns, visibleColumnsList } = this.state;

        // only export visible and exportable columns
        let columnsToExport = columns
            .filter(c => c.exportable === true && visibleColumnsList.indexOf(c.prop) !== -1)
            .map(c => { return { label: c.name, key: c.prop } });
        let dataToExport = pick(data, columnsToExport.map(x => x.key));

        if (type === "txt" || type === "json") {
            const fileName = new Date().toISOString() + "." + type

            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";

            var json = JSON.stringify(dataToExport),
                blob = new Blob([json], { type: "octet/stream" }),
                url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        }
        else {
            const fileName = new Date().toISOString()

            // await getExcelFile(fileName, type, dataToExport)

            ExportFromJSON({ data: dataToExport, fileName: fileName, exportType: type })
        }
    }

    onExpandToggle = (e, { rowkey, rowdata }) => {
        this.setState(function (prev) {
            const visible = prev.expandedRows.indexOf(rowkey) === -1

            // callback
            if (this.props.onRowExpandToggle) {
                this.props.onRowExpandToggle(visible, rowkey, rowdata);
            }

            if (visible) {
                return { expandedRows: [...prev.expandedRows, rowkey] };
            } else {
                return { expandedRows: prev.expandedRows.filter(e => e !== rowkey) }
            }
        });
    }

    onTableHeaderShow = () => {
        this.setState({ showTableHeader: true });
    }

    renderTableFunctions(numRecords) {
        const {
            columns,
            columnToggle,
            limit,
            limitInput,
            limitInputValid,
            multiSearchInput,
            multiSearchInputValid,
            showColumnFilters,
            showColumnToggles,
            showTableHeader,
            visibleColumnsList,
        } = this.state;

        let columnToggleButton = null,
            toggleColumnsRow = null;

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
        }

        if (showTableHeader !== false) {
            if (showTableHeader !== "hidden") {
                return (
                    <Grid>
                        <Grid.Row>
                            <Grid.Column floated='left' width={4}>
                                <Input
                                    label={(
                                        <Label className='iconMargin'>
                                            <Popup on='click' hideOnScroll trigger={<Icon name='question circle' size='small' />} inverted>
                                                <Popup.Content>
                                                    Did you know that you can also use <a target="_blank" rel="noopener noreferrer" href='https://regexr.com/'>Regular Expressions</a> in this filter and column filters by prefixing your expression with "~"?
                                                </Popup.Content>
                                            </Popup>
                                            Filter:
                                        </Label>
                                    )}
                                    id="multiSearchFilterInBuffedTable"
                                    fluid
                                    value={multiSearchInput}
                                    placeholder="Type to search..."
                                    name="multiSearchInput"
                                    onChange={this.handleMultiFilterChange}
                                    error={!multiSearchInputValid} />
                            </Grid.Column>
                            <Grid.Column width={1}>
                                <Dropdown icon={<Icon className="iconMargin" name='share' />} item text='Export'>
                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            onClick={this.handleExport}
                                            value={ExportFromJSON.types.txt}
                                            icon={<Icon name='file text outline' />}
                                            text='Export to TXT' />
                                        <Dropdown.Item
                                            onClick={this.handleExport}
                                            value={ExportFromJSON.types.json}
                                            icon={<Icon name='file text outline' />}
                                            text='Export to JSON' />
                                        <Dropdown.Item
                                            onClick={this.handleExport}
                                            value={ExportFromJSON.types.csv}
                                            icon={<Icon name='file text outline' />}
                                            text='Export to CSV' />
                                        <Dropdown.Item
                                            onClick={this.handleExport}
                                            value={ExportFromJSON.types.xls}
                                            icon={<Icon name='file excel' />}
                                            text='Export to XLS' />
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <div style={{ float: "right", margin: "0 20px", display: limit === 0 ? "none" : "visible" }}>
                                    <span>Showing {numRecords > 0 ? this.state.offset + 1 : 0} to {numRecords < limit ? numRecords : this.state.offset + limit} of {numRecords} entries</span>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <div style={{ float: "left", margin: "0 20px", display: limit === 0 ? "none" : "visible" }}>
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
                                    {this.props.renderCustomFilter()}
                                </>

                            </Grid.Column>
                        </Grid.Row>
                        {toggleColumnsRow}
                    </Grid>
                )
            }
            else {
                return (
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Popup trigger={
                                    <Button compact onClick={this.onTableHeaderShow} icon floated="right">
                                        <Icon name="setting"></Icon>
                                    </Button>
                                } content='Show table settings' inverted />

                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                )
            }
        }
        return null;
    }

    render() {
        const {
            columnDistinctValues,
            columns,
            grouping,
            visibleColumnsList,
            sortColumn,
            sortDirection,
            multiSearch,
            multiSearchInputValid,
            limit,
            showColumnFilters,
            data,
            filters,
            filterInputs,
            filterInputsValid,
            offset,
            expandedRows
        } = this.state;

        const {
            compact,
            expandable,
            getDataKey
        } = this.props;

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

        var renderData, tableFooter, filteredData,
            filterColumnsRow,
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
        if (expandable) {
            headerCells.unshift((
                <Table.HeaderCell
                    collapsing
                    key="expand"
                    disabled
                />
            ));
        }
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

        if (multiSearchInputValid && multiSearch != null) {
            filteredData = filterInArrayOfObjects(multiSearch, data, visibleColumns.filter(c => c.searchable !== false).map(c => c.prop));
        } else {
            filteredData = data;
        }

        filteredData = this.props.customFilterCallback(filteredData);

        if (showColumnFilters) {
            for (let col of Object.getOwnPropertyNames(filters)) {
                if (filters[col] != null) {
                    filteredData = filteredData.filter(filters[col]);
                }
            }
        }

        if (limit && filteredData.length > limit) {
            renderData = filteredData.slice(offset, offset + limit)
            tableFooter = (
                <Pagination
                    className="pagination"
                    compact
                    reduced
                    size="small"
                    floated="right"
                    offset={offset}
                    limit={limit}
                    total={filteredData.length}
                    onClick={this.handlePaginationChange}
                />
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
                if (c.searchable === true) {
                    filterInput = (<Input fluid name={c.prop} onChange={this.handleColumnFilterChange} value={filterInputs[c.prop]} error={!filterInputsValid[c.prop]} />)
                } else if (c.searchable === "distinct") {
                    filterInput = (<Dropdown fluid search selection name={c.prop} onChange={this.handleColumnFilterDropdown} value={filterInputs[c.prop]} options={columnDistinctValues[c.prop]} selectOnNavigation={false} />)
                }
                return (
                    <Table.HeaderCell collapsing={c.collapsing} width={c.collapsing ? null : c.width} key={c.prop}>
                        {filterInput}
                    </Table.HeaderCell>
                );
            })
            if (expandable) {
                headerFilterCells.unshift((<Table.HeaderCell collapsing key="expand">
                </Table.HeaderCell>))
            }
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
        let transformer = this.props.transformDataRow ? data => this.props.transformDataRow(Object.assign({}, data)) : data => data;
        renderData.map(transformer).forEach(data => {

            let rowKey = getDataKey(data);
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
            let cells = visibleColumns.map(c => {
                let cellData;
                if (c.data === false) {
                    return null;
                }
                if (c.display) {
                    cellData = data[c.display];
                } else {
                    cellData = data[c.prop];
                }
                return (<Table.Cell style={data[c.styleProp] ? data[c.styleProp] : null} key={c.prop}>{cellData}</Table.Cell>)
            });
            if (expandable === true) {
                let expandName = isRowExpanded ? "minus" : "plus";
                cells.unshift((
                    <Table.Cell key="expand" collapsing>
                        <Icon link
                            rowkey={rowKey}
                            rowdata={data}
                            name={expandName + " square outline"}
                            onClick={this.onExpandToggle} />
                    </Table.Cell>));
            }

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
            if (isRowExpanded) {
                tableBody.push((
                    <Table.Row key={'expanded' + rowKey}>
                        {/* +1 because there is extra column for toggling */}
                        <Table.Cell />
                        <Table.Cell style={{ borderLeft: 'none', paddingTop: '0px' }} colSpan={visibleColumns.length}>{this.props.renderExpandedRow(rowKey, data)}</Table.Cell>
                    </Table.Row>
                ));
            }

            // important for drawing grouping headers
            prevRow = data;
        });

        var tableFunctionsGrid = this.renderTableFunctions(filteredData.length);

        return (
            <div className="generic table">
                {tableFunctionsGrid}
                <div className="scroll-wrapper">
                    <Table compact={compact} selectable sortable celled basic='very'>
                        <Table.Header>
                            <Table.Row>{headerCells}</Table.Row>
                        </Table.Header>
                        {filterColumnsRow}
                        <Table.Body>
                            {tableBody}
                        </Table.Body>
                    </Table>
                </div>
                {tableFooter}
            </div >
        );
    }

    static renderCustomFilter() {
        return null;
    }

    static onRowExpandToggle(visible, rowKey, rowData) { // eslint-disable-line no-unused-vars
        return;
    }

    static renderExpandedRow(rowKey, rowData) { // eslint-disable-line no-unused-vars
        return null;
    }

    static customFilterCallback(filteredData) {
        return filteredData;
    }

    static getDataKey(data) {
        return data.Id
    }
}
