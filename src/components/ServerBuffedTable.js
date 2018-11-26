import _ from 'lodash'
import React, { Component } from 'react'
import { Table, Input, Button, Grid } from 'semantic-ui-react'
import Pagination from 'semantic-ui-react-button-pagination';
import { filterInArrayOfObjects, debounce, getServerState } from '../utils/HelperFunction';
import ServerStatus from './ServerStatus';
import DismeStatus from './DismeStatus';
import { Link } from 'react-router-dom';

export default class ServerBuffedTable extends Component {

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
            filterServerName: "",
            filterServerOwner: "",
            filterEnv: "",
            filterDC: "",
            filterOS: "",
            filterCountry: "",
            data: this.props.data
        }

        this.handleChange = debounce(this.handleChange, 400);
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.data });
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
            filterServerName: "",
            filterServerOwner: "",
            filterEnv: "",
            filterDC: "",
            filterOS: "",
            filterCountry: ""
        });
    }

    render() {

        const { column, direction, multiSearchInput, defaultLimit, showColumnFilters,
            filterServerName, filterServerOwner, filterEnv, filterDC, filterOS, filterCountry, data } = this.state

        var renderData, tableFooter, filteredData, filterColumnsRow;

        if (multiSearchInput !== "") {
            var mappedServers = data.map(server => {
                return (
                    {
                        Id: server.Id,
                        ServerName: server.ServerName,
                        ServerState: server.ServerState,
                        Disme: server.Disme,
                        ServerOwner: server.ServerOwner,
                        Environment: server.Environment,
                        DataCenter: server.DataCenter,
                        CountryName: server.CountryName,
                        OperatingSystem: server.OperatingSystem
                    }
                )
            })

            filteredData = filterInArrayOfObjects(multiSearchInput, mappedServers)
        }
        else {
            filteredData = data
        }

        if (!_.isEmpty(filterServerName)) {
            filteredData = filteredData.filter(data => {
                return data.ServerName.search(new RegExp(filterServerName, "i")) >= 0
            })
        }

        if (!_.isEmpty(filterServerOwner)) {
            filteredData = filteredData.filter(data => {
                if (data.ServerOwner) {
                    return data.ServerOwner.search(new RegExp(filterServerOwner, "i")) >= 0
                }
            })
        }

        if (!_.isEmpty(filterEnv)) {
            filteredData = filteredData.filter(data => {
                return data.Environment.search(new RegExp(filterEnv, "i")) >= 0
            })
        }

        if (!_.isEmpty(filterDC)) {
            filteredData = filteredData.filter(data => {
                if (data.DataCenter) {
                    return data.DataCenter.search(new RegExp(filterDC, "i")) >= 0
                }
            })
        }

        if (!_.isEmpty(filterOS)) {
            filteredData = filteredData.filter(data => {
                if (data.OperatingSystem) {
                    return data.OperatingSystem.search(new RegExp(filterOS, "i")) >= 0
                }
            })
        }

        if (!_.isEmpty(filterCountry)) {
            filteredData = filteredData.filter(data => {
                return data.CountryName.search(new RegExp(filterCountry, "i")) >= 0
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
                            <Input fluid name='filterServerName' onChange={this.handleChange} />
                        </Table.HeaderCell>
                        <Table.HeaderCell width={2}>
                        </Table.HeaderCell>
                        <Table.HeaderCell width={1}>
                            <Input fluid name='filterServerOwner' onChange={this.handleChange} />
                        </Table.HeaderCell>
                        <Table.HeaderCell width={3}>
                            <Input fluid name='filterEnv' onChange={this.handleChange} />
                        </Table.HeaderCell>
                        <Table.HeaderCell width={1}>
                            <Input fluid name='filterDC' onChange={this.handleChange} />
                        </Table.HeaderCell>
                        <Table.HeaderCell width={2}>
                            <Input fluid name='filterCountry' onChange={this.handleChange} />
                        </Table.HeaderCell>
                        <Table.HeaderCell width={4}>
                            <Input fluid name='filterOS' onChange={this.handleChange} />
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
            )
        }
        else {
            filterColumnsRow = <Table.Header></Table.Header>
        }
        return (
            <>
                <Grid>
                    <Grid.Column floated='left' width={4}>
                        <div id="multiSearchFilterInBuffedTable">

                            <Input label='filter:' placeholder="Type to search..." name="multiSearchInput" onChange={this.handleChange} ></Input>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={10} >

                    </Grid.Column>
                    <Grid.Column floated='right' width={2} textAlign="right">
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
                <Table selectable sortable celled basic='very'>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell
                                width={3}
                                sorted={column === 'ServerName' ? direction : null}
                                onClick={this.handleSort('ServerName')}
                                content='ServerName'
                            />
                            <Table.HeaderCell
                                disabled
                                width={2}
                                // sorted={column === 'ServerName' ? direction : null}
                                // onClick={this.handleSort('ServerName')}
                                content='Status | Disme'
                            />
                            <Table.HeaderCell
                                width={1}
                                sorted={column === 'ServerOwner' ? direction : null}
                                onClick={this.handleSort('ServerOwner')}
                                content='ServerOwner'
                            />
                            <Table.HeaderCell
                                width={3}
                                sorted={column === 'Environment' ? direction : null}
                                onClick={this.handleSort('Environment')}
                                content='Env'
                            />
                            <Table.HeaderCell
                                width={1}
                                sorted={column === 'DataCenter' ? direction : null}
                                onClick={this.handleSort('DataCenter')}
                                content='DC'
                            />
                            <Table.HeaderCell
                                width={2}
                                sorted={column === 'CountryName' ? direction : null}
                                onClick={this.handleSort('CountryName')}
                                content='Country'
                            />
                            <Table.HeaderCell
                                width={4}
                                sorted={column === 'OperatingSystem' ? direction : null}
                                onClick={this.handleSort('OperatingSystem')}
                                content='OS'
                            />
                        </Table.Row>
                    </Table.Header>
                    {filterColumnsRow}
                    <Table.Body>
                        {renderData.map(data => {
                            return (
                                <Table.Row key={data.Id}>
                                    <Table.Cell>
                                        <Link to={'/server/' + data.Id} target="_blank">
                                            {data.ServerName}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {<ServerStatus size='small' serverState={data.ServerState} />}
                                        {<DismeStatus size='small' dismeStatus={data.Disme} />}
                                    </Table.Cell>
                                    <Table.Cell>{data.ServerOwner}</Table.Cell>
                                    <Table.Cell>{data.Environment}</Table.Cell>
                                    <Table.Cell>{data.DataCenter}</Table.Cell>
                                    <Table.Cell>{data.CountryName}</Table.Cell>
                                    <Table.Cell>{data.OperatingSystem}</Table.Cell>
                                </Table.Row>
                            )
                        })
                        }
                    </Table.Body>
                    {tableFooter}
                </Table>
            </>
        )
    }
}