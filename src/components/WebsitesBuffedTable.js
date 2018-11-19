import _ from 'lodash'
import React, { Component } from 'react'
import { Table, Input, Button } from 'semantic-ui-react'
import Pagination from 'semantic-ui-react-button-pagination';
import { filterInArrayOfObjects, debounce } from '../utils/HelperFunction';
import { groupBy } from '../utils/HelperFunction';

import ServerStatus from './ServerStatus';
import DismeStatus from './DismeStatus';
import { arrayOf } from 'prop-types';

export default class WebsitesBuffedTable extends Component {

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
            // filterEnvironment: "",
            filterSiteId: "",
            filterAppPoolName: "",
            filterBindings: "",
            filterFrameWork: "",
            filterAutoStart: "",
            filterUser: "",
            filterState: "",
            filterPeriodicalRecycle: "",
            filterIdleTimeout: "",
            data: this.props.data
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
            filterServerName: "",
            // filterEnvironment: "",
            filterSiteId: "",
            filterAppPoolName: "",
            filterBindings: "",
            filterFrameWork: "",
            filterAutoStart: "",
            filterUser: "",
            filterState: "",
            filterPeriodicalRecycle: "",
            filterIdleTimeout: "",
        });
    }

    render() {

        const { column, direction, multiSearchInput, defaultLimit, showColumnFilters,
            filterServerName, filterEnvironment,
            filterSiteId,
            filterAppPoolName,
            filterBindings,
            filterFrameWork,
            filterAutoStart,
            filterUser,
            filterState,
            filterPeriodicalRecycle,
            filterIdleTimeout, data } = this.state

        var renderData, tableFooter, filteredData, filterColumnsRow;

            console.log("this.state.data:" + JSON.stringify(data))
        var mappedWebsites = this.props.data.Websites.map(website => {
            return (
                {
                    Id: website.Id,
                    ServerName: website.ServerName,
                    Environment: website.Environment,
                    SiteId: website.SiteId,
                    AppPoolName: website.AppPoolName,
                    Bindings: website.Bindings.map(binding => {
                        return (
                            binding.IpAddress + ":" + binding.Port + ":" + binding.Binding
                        )
                    }),
                    FrameWork: website.AppPool.FrameWork,
                    AutoStart: website.AppPool.AutoStart.toString(),
                    User: website.AppPool.User,
                    State: website.AppPool.State,
                    PeriodicRecycle: website.AppPool.PeriodicRecycle,
                    IdleTimeout: website.AppPool.IdleTimeout,
                }
            )
        })
        if (multiSearchInput !== "") {
            filteredData = filterInArrayOfObjects(multiSearchInput, mappedWebsites)
        }
        else {
            filteredData = mappedWebsites
        }

        if (!_.isEmpty(filterIdleTimeout)) {
            filteredData = filteredData.filter(data => {
                if (data.IdleTimeout) {
                    return data.IdleTimeout.search(new RegExp(filterIdleTimeout, "i")) >= 0
                }
            })
        }

        if (!_.isEmpty(filterPeriodicalRecycle)) {
            filteredData = filteredData.filter(data => {
                if (data.PeriodicRecycle) {
                    return data.PeriodicRecycle.search(new RegExp(filterPeriodicalRecycle, "i")) >= 0
                }
            })
        }

        if (!_.isEmpty(filterState)) {
            filteredData = filteredData.filter(data => {
                if (data.State) {
                    return data.State.search(new RegExp(filterState, "i")) >= 0
                }
            })
        }

        if (!_.isEmpty(filterUser)) {
            filteredData = filteredData.filter(data => {
                if (data.User) {
                    return data.User.search(new RegExp(filterUser, "i")) >= 0
                }
            })
        }

        if (!_.isEmpty(filterAutoStart)) {
            filteredData = filteredData.filter(data => {
                if (data.AutoStart) {
                    return data.AutoStart.search(new RegExp(filterAutoStart, "i")) >= 0
                }
            })
        }

        if (!_.isEmpty(filterFrameWork)) {
            filteredData = filteredData.filter(data => {
                if (data.FrameWork) {
                    return data.FrameWork.search(new RegExp(filterFrameWork, "i")) >= 0
                }
            })
        }

        if (!_.isEmpty(filterBindings)) {
            filteredData = filteredData.filter(data => {
                if (data.Bindings.length > 0) {
                    for(var binding of data.Bindings) {
                        if(binding.search(new RegExp(filterBindings, "i")) >= 0) {
                            return data
                        }
                    }
                    // return data.Bindings.search(new RegExp(filterBindings, "i")) >= 0
                }
            })
        }

        if (!_.isEmpty(filterAppPoolName)) {
            filteredData = filteredData.filter(data => {
                if (data.AppPoolName) {
                    return data.AppPoolName.search(new RegExp(filterAppPoolName, "i")) >= 0
                }
            })
        }

        if (!_.isEmpty(filterSiteId)) {
            filteredData = filteredData.filter(data => {
                if (data.SiteId) {
                    return data.SiteId.toString().search(new RegExp(filterSiteId, "i")) >= 0
                }
            })
        }

        if (!_.isEmpty(filterServerName)) {
            filteredData = filteredData.filter(data => {
                if (data.ServerName) {
                    return data.ServerName.search(new RegExp(filterServerName, "i")) >= 0
                }
            })
        }

        // if (!_.isEmpty(filterEnvironment)) {
        //     filteredData = filteredData.filter(data => {
        //         if (data.Environment) {
        //             return data.Environment.search(new RegExp(filterEnvironment, "i")) >= 0
        //         }
        //     })
        // }

        if (filteredData.length > defaultLimit) {
            renderData = filteredData.slice(this.state.offset, this.state.offset + defaultLimit)
            tableFooter = (
                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell colSpan='11'>
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
                        <Table.HeaderCell width={1}>
                            <Input fluid name='filterServerName' onChange={this.handleChange} />
                        </Table.HeaderCell>
                        {/* <Table.HeaderCell width={1}>
                            <Input fluid name='filterEnvironment' onChange={this.handleChange} />
                        </Table.HeaderCell> */}
                        <Table.HeaderCell width={1}>
                            <Input fluid name='filterSiteId' onChange={this.handleChange} />
                        </Table.HeaderCell>
                        <Table.HeaderCell width={3}>
                            <Input fluid name='filterAppPoolName' onChange={this.handleChange} />
                        </Table.HeaderCell>
                        <Table.HeaderCell width={5}>
                            <Input fluid name='filterBindings' onChange={this.handleChange} />
                        </Table.HeaderCell>
                        <Table.HeaderCell width={2}>
                            <Input fluid name='filterFrameWork' onChange={this.handleChange} />
                        </Table.HeaderCell>
                        <Table.HeaderCell width={1}>
                            <Input fluid name='filterAutoStart' onChange={this.handleChange} />
                        </Table.HeaderCell>
                        <Table.HeaderCell width={1}>
                            <Input fluid name='filterUser' onChange={this.handleChange} />
                        </Table.HeaderCell>
                        <Table.HeaderCell width={1}>
                            <Input fluid name='filterState' onChange={this.handleChange} />
                        </Table.HeaderCell>
                        <Table.HeaderCell width={1}>
                            <Input fluid name='filterPeriodicalRecycle' onChange={this.handleChange} />
                        </Table.HeaderCell>
                        <Table.HeaderCell width={1}>
                            <Input fluid name='filterIdleTimeout' onChange={this.handleChange} />
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
            )
        }
        else {
            filterColumnsRow = <Table.Header></Table.Header>
        }

        var kokot = groupBy(renderData, "Environment")


        var pica = (
            Object.keys(kokot).map((key, index) => {
                return (
                    <React.Fragment key={index}>
                        <Table.Row key={key}>
                            <Table.HeaderCell style={{backgroundColor: '#f2f2f2'}} colSpan='11'>{key}</Table.HeaderCell>

                        </Table.Row>
                        {
                            kokot[key].map(d => {
                                return (
                                    <Table.Row key={d.Id}>
                                        <Table.Cell>{d.ServerName}</Table.Cell>
                                        {/* <Table.Cell>{d.Environment}</Table.Cell> */}
                                        <Table.Cell>{d.SiteId}</Table.Cell>
                                        <Table.Cell>{d.AppPoolName}</Table.Cell>
                                        <Table.Cell>{d.Bindings.map(binding => {
                                            return (
                                                <span key={binding}>{binding} <br /></span>
                                            )
                                        })}</Table.Cell>
                                        <Table.Cell>{d.FrameWork}</Table.Cell>
                                        <Table.Cell>{d.AutoStart}</Table.Cell>
                                        <Table.Cell>{d.User}</Table.Cell>
                                        <Table.Cell>{d.State}</Table.Cell>
                                        <Table.Cell>{d.PeriodicRecycle}</Table.Cell>
                                        <Table.Cell>{d.IdleTimeout}</Table.Cell>
                                    </Table.Row>
                                )
                            })
                        }
                    </React.Fragment>
                )
            })
        )

        return (
            <Table sortable celled basic='very'>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan={1} textAlign="left">
                            <Input placeholder="Type to search..." name="multiSearchInput" onChange={this.handleChange} ></Input>
                        </Table.HeaderCell>
                        <Table.HeaderCell colSpan={10} textAlign="right">
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
                            width={1}
                            sorted={column === 'ServerName' ? direction : null}
                            onClick={this.handleSort('ServerName')}
                            content='Server Name'
                        />
                        {/* <Table.HeaderCell
                            width={2}
                            sorted={column === 'Environment' ? direction : null}
                            onClick={this.handleSort('Environment')}
                            content='Environment'
                        /> */}
                        <Table.HeaderCell
                            width={1}
                            sorted={column === 'SiteId' ? direction : null}
                            onClick={this.handleSort('SiteId')}
                            content='Site ID'
                        />
                        <Table.HeaderCell
                            width={3}
                            sorted={column === 'AppPoolName' ? direction : null}
                            onClick={this.handleSort('AppPoolName')}
                            content='AppPool Name'
                        />
                        <Table.HeaderCell
                            disabled
                            width={5}
                            // sorted={column === 'Bindings' ? direction : null}
                            // onClick={this.handleSort('Bindings')}
                            content='Bindings'
                        />
                        <Table.HeaderCell
                            width={2}
                            sorted={column === 'FrameWork' ? direction : null}
                            onClick={this.handleSort('FrameWork')}
                            content='Framework'
                        />
                        <Table.HeaderCell
                            width={1}
                            sorted={column === 'AutoStart' ? direction : null}
                            onClick={this.handleSort('AutoStart')}
                            content='AutoStart'
                        />
                        <Table.HeaderCell
                            width={1}
                            sorted={column === 'User' ? direction : null}
                            onClick={this.handleSort('User')}
                            content='User'
                        />
                        <Table.HeaderCell
                            width={1}
                            sorted={column === 'State' ? direction : null}
                            onClick={this.handleSort('State')}
                            content='State'
                        />
                        <Table.HeaderCell
                            width={1}
                            sorted={column === 'PeriodicRecycle' ? direction : null}
                            onClick={this.handleSort('PeriodicRecycle')}
                            content='Per.Recycle'
                        />
                        <Table.HeaderCell
                            width={1}
                            sorted={column === 'IdleTimeout' ? direction : null}
                            onClick={this.handleSort('IdleTimeout')}
                            content='IdleTimeout'
                        />
                    </Table.Row>
                </Table.Header>
                {filterColumnsRow}
                <Table.Body>
                    {pica
                    }
                </Table.Body>
                {tableFooter}
            </Table>
        )
    }
}