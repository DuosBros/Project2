import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getLoadBalancerPoolStatus } from '../requests/LoadBalancerFarmsAxios';
import { getLoadBalancerPoolStatusAction } from '../actions/LoadBalancerFarmsAction';
import { Button } from 'semantic-ui-react';
import GenericTable, { GenericTablePropTypes } from './GenericTable';
import VsStatus from './VsStatus';
import LBPoolStatus from './LBPoolStatus';

class LoadBalancerFarmsTable extends GenericTable {
    static defaultProps = {
        ...GenericTable.defaultProps,
        defaultShowBETAPools: true
    }

    static propTypes = {
        ...GenericTablePropTypes,
        defaultShowBETAPools: PropTypes.bool
    }

    constructor(props) {
        super(props);
        this.state.showBETAPools = props.defaultShowBETAPools;
    }

    getColumns() {
        return [
            {
                name: "Data Center",
                prop: "DataCenter",
                visibleByDefault: false,
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
                width: 1
            }
        ];
    }

    isExpandable() {
        return true;
    }

    onRowExpandToggle(visible, rowKey, rowData) {
        // TODO: trigger pool status fetch
        if(visible) {
            console.log("onRowExpandToggle", { visible, rowKey, rowData });
            getLoadBalancerPoolStatus(rowData.LbId, rowData.Pool);
        }
    }

    renderExpandedRow(rowKey, rowData) {
        // TODO: this.props.loadbalancerFarmsStore
        return (<div>{rowKey}</div>);
    }

    onComponentDidMount() {
        this.setState({ showBETAPools: false });
    }

    applyCustomFilter(filteredData) {
        const { showBETAPools } = this.state;

        if (!showBETAPools) {
            filteredData = filteredData.filter(x => x.Pool.search(new RegExp("\\.beta\\.", "i")) < 0)
        }
        return filteredData;
    }

    transformDataRow(data) {
        data.VsStatus = (<VsStatus availabilityState={data.VsAvailabilityState} enabledState={data.VsEnabledState} />);
        data.PoolStatus = (<LBPoolStatus availabilityState={data.PoolAvailabilityState} enabledState={data.PoolEnabledState} />);
        return data;
    }

    renderCustomFilter() {
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
}

function mapStateToProps(state) {
    return {
        loadbalancerFarmsStore: state.LoadBalancerFarmsReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        /* getLoadBalancerPoolStatusAction */
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadBalancerFarmsTable);
