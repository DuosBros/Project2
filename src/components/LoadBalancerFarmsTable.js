import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getLoadBalancerPoolStatus } from '../requests/LoadBalancerFarmsAxios';
import { setLoadBalancerPoolStatusAction, setLoadBalancerPoolStatusLoadingAction } from '../actions/LoadBalancerFarmsAction';
import { Dimmer, Loader, Button, Icon, Popup } from 'semantic-ui-react';
import GenericTable from './GenericTable';
import VsStatus from './VsStatus';
import LBPoolStatus from './LBPoolStatus';
import { getAvailabiltyAndEnabledState } from '../utils/HelperFunction';

const ExpandedRowLBPoolMembersContent = (props) => {
    let color = getAvailabiltyAndEnabledState(props.data.Availability, props.data.Enabled)
    let ipPort = props.data.Ip + ":" + props.data.Port;
    let serverName = props.data.Server ? <Link to={'/server/' + props.data.Serverid}>{props.data.Server}</Link> : "Server not found"
    return (
        <li key={ipPort}>
            <Popup size='large' inverted trigger={
                <Icon color={color} name="circle" />
            } content={"Availability: " + props.data.Availability + " | Enabled: " + props.data.Enabled} />
            {ipPort} | {serverName} | {props.data.Description}
        </li>
    )
}

class LoadBalancerFarmsTable extends Component {
    static defaultProps = {
        defaultShowBETAPools: false
    }

    static propTypes = {
        defaultShowBETAPools: PropTypes.bool
    }

    constructor(props) {
        super(props);
        this.state = {
            showBETAPools: props.defaultShowBETAPools
        };
    }

    columns = [
        {
            name: "Data Center",
            prop: "DataCenter",
            visibleByDefault: true,
            searchable: "distinct",
            width: 1
        },
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
            name: "VS Status",
            prop: "VsStatus",
            width: 2,
            collapsing: true,
            sortable: false,
            searchable: false
        },
        {
            name: "Pool Status",
            prop: "PoolStatus",
            width: 1,
            collapsing: true,
            sortable: false,
            searchable: false
        },
        {
            name: "Port",
            prop: "Port",
            width: 1,
            searchable: "distinct",
            collapsing: true
        },
        {
            name: "IP Address",
            prop: "IpAddress",
            width: 2,
            collapsing: true
        },
        {
            name: "Load Balancer Name",
            prop: "LbName",
            searchable: "distinct",
            width: 2
        },
        {
            name: "Host",
            prop: "Label",
            width: 2
        },
        {
            name: "Env",
            prop: "Environment",
            visibleByDefault: false,
            searchable: "distinct",
            width: 1
        }
    ]

    onRowExpandToggle = (visible, rowKey, rowData) => {
        // TODO: trigger pool status fetch
        if (visible) {
            this.props.setLoadBalancerPoolStatusLoadingAction(rowData.LbId, rowData.Pool, true)
            getLoadBalancerPoolStatus(rowData.LbId, rowData.Pool)
                .then(response => this.props.setLoadBalancerPoolStatusAction(rowData.LbId, rowData.Pool, response));
        }
    }

    renderExpandedRow = (rowKey, rowData) => {
        const poolStatus = this.props.loadbalancerFarmsStore.loadBalancerPoolStatus;
        if (!poolStatus) {
            return (<p>no load balancer data present</p>);
        }

        const lb = poolStatus[rowData.LbId];
        if (!lb) {
            return (<p>no pool status data present</p>);
        }

        var pool = lb[rowData.Pool];
        if (!pool) {
            return (<p>pool status unknown</p>);
        }

        let content = null;
        if (pool.success === true) {
            content = this.renderPools(pool.data);
        } else {
            if (!pool.data && pool.loading) {
                content = "loading..."
            } else {
                let msg = "unknown error";
                if (pool.error) {
                    msg = pool.error;
                }
                content = (<p>Error loading pool status: {msg}</p>);
            }
        }

        return (
            <div style={{ position: "relative" }}>
                <Dimmer active={pool.loading === true} size="mini" inverted>
                    <Loader />
                </Dimmer>
                {content}
            </div>
        );
    }

    renderPools(pool) {
        let res = pool.map(p => {
            return <ExpandedRowLBPoolMembersContent data={p} />
        });
        return (<ul>{res}</ul>);
    }

    customFilterCallback = (filteredData) => {
        const { showBETAPools } = this.state;

        if (!showBETAPools) {
            filteredData = filteredData.filter(x => x.Pool.search(new RegExp("\\.beta\\.", "i")) < 0)
        }
        return filteredData;
    }

    transformDataRow = (data) => {
        data.VsStatus = (<VsStatus availabilityState={data.VsAvailabilityState} enabledState={data.VsEnabledState} />);
        data.PoolStatus = (<LBPoolStatus availabilityState={data.PoolAvailabilityState} enabledState={data.PoolEnabledState} />);
        return data;
    }

    handleStateToggle = (e, { name }) => {
        this.setState({
            [name]: !this.state[name]
        });
    }

    renderCustomFilter = () => {
        const { showBETAPools } = this.state;
        return (
            <div>
                <Button
                    size="small"
                    name="showBETAPools"
                    onClick={this.handleStateToggle}
                    compact
                    content={showBETAPools ? 'Hide BETA Pools' : 'Show BETA Pools'}
                    style={{ padding: '0.3em', marginTop: '0.5em', textAlign: 'right' }}
                    id="secondaryButton"
                    icon={showBETAPools ? 'eye slash' : 'eye'}
                    labelPosition='right' />
            </div>
        );
    }

    render() {
        return (
            <GenericTable
                columns={this.columns}
                grouping={this.grouping}
                transformDataRow={this.transformDataRow}
                renderCustomFilter={this.renderCustomFilter}
                customFilterCallback={this.customFilterCallback}
                expandable
                onRowExpandToggle={this.onRowExpandToggle}
                renderExpandedRow={this.renderExpandedRow}
                {...this.props}
            />
        );
    }
}

function mapStateToProps(state) {
    return {
        loadbalancerFarmsStore: state.LoadBalancerFarmsReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setLoadBalancerPoolStatusAction,
        setLoadBalancerPoolStatusLoadingAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadBalancerFarmsTable);
