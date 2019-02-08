import React from 'react';
import { Menu, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleVerticalMenuAction } from '../actions/HeaderActions';


class Sidebar extends React.Component {

    handleToggleSlider = () => {
        this.props.toggleVerticalMenuAction();
    }

    render() {

        var collapseMenuItem, NavMenu;

        if (this.props.headerStore.showVerticalMenu) {
            NavMenu = (
                <div>
                    <Menu.Item as={Link} to='/'>
                        <Menu.Header>Home</Menu.Header>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header as={Link} to='/servers'>Server</Menu.Header>
                        <Menu.Menu>
                            <Menu.Item as={Link} to='/patchgroups'>
                                Patch Groups
                            </Menu.Item>
                            <Menu.Item as={Link} to='/virtualmachines' >
                                Virtual Machines
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header as={Link} to='/services'>Services</Menu.Header>
                        <Menu.Menu>
                            <Menu.Item as={Link} to='/rolloutstatus' >
                                Rollout Status
                            </Menu.Item>
                            <Menu.Item as={Link} to='/versionstatus' >
                                Version Status
                            </Menu.Item>
                            {/*
                            <Menu.Item as={Link} to='/theming' >
                                HealthChecks
                            </Menu.Item>
                            <Menu.Item as={Link} to='/theming' >
                                Availability
                            </Menu.Item> */}
                        </Menu.Menu>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header as={Link} to='/lbfarms'>Loadbalancer Farms</Menu.Header>
                        {/* <Menu.Menu>
                            <Menu.Item as={Link} to='/' >
                                Consistency
                            </Menu.Item>
                        </Menu.Menu> */}
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header as={Link} to='/ipaddresses'>IPAddresses</Menu.Header>
                        {/* <Menu.Menu>
                            <Menu.Item as={Link} to='/' >
                                Consistency
                            </Menu.Item>
                        </Menu.Menu> */}
                    </Menu.Item>
                    {/* <Menu.Item>
                        <Menu.Header>Scom</Menu.Header>
                    </Menu.Item> */}
                    {/* <Menu.Item>
                        <Menu.Header>Config</Menu.Header>
                        <Menu.Menu>
                            <Menu.Item as={Link} to='/' >
                                Loadbalancer
                            </Menu.Item>
                            <Menu.Item as={Link} to='/usage' >
                                ActiveDirectory
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu.Item> */}
                    <Menu.Item>
                        <Menu.Header>Statistics</Menu.Header>
                        <Menu.Menu>
                            {/* <Menu.Item as={Link} to='/statistics/servers' >
                                Servers
                            </Menu.Item> */}
                            <Menu.Item as={Link} to='/statistics/services' >
                                Services
                            </Menu.Item>
                            {/* <Menu.Item as={Link} to='/statistics/loadbalancerfarms' >
                                LoadBalancer Farms
                            </Menu.Item> */}
                        </Menu.Menu>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header as={Link} to='/admin'>Admin</Menu.Header>
                    </Menu.Item>
                    {/* <Menu.Item>
                        <Menu.Header>Help</Menu.Header>
                    </Menu.Item> */}
                    {/* <Menu.Item>
                        <Menu.Header>About</Menu.Header>
                    </Menu.Item> */}
                </div>
            );

            collapseMenuItem = (
                <Menu.Header>
                    <Icon name='angle double left' />
                    Collapse sidebar
                </Menu.Header>
            )
        }
        else {
            collapseMenuItem = (
                <Menu.Header>
                    <Icon name='angle double right' />
                </Menu.Header>
            )
        }

        return (
            <div id={this.props.headerStore.showVerticalMenu ? "verticalMenu" : "hiddenVerticalMenu"}>
                <Menu inverted fluid vertical borderless>
                    {NavMenu}
                </Menu>
                <div className="sidebarCollapser">
                    <Menu inverted fluid vertical borderless>
                        <Menu.Item onClick={() => this.handleToggleSlider()} position="right">
                            {collapseMenuItem}
                        </Menu.Item>
                    </Menu>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        headerStore: state.HeaderReducer,
        baseStore: state.BaseReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleVerticalMenuAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
