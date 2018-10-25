import React from 'react';
import keyboardKey from 'keyboard-key'
import { Menu, Button, Header as HeaderSemantic, Dropdown, Ref } from 'semantic-ui-react'
// import { Link, withRouter } from 'react-static';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchServersAction, searchServiceShortcutAction, toggleVerticalMenuAction } from '../actions/HeaderActions';
import { searchServers, searchServiceShortcut } from '../requests/HeaderAxios';

import { getServerDetailsAction } from '../actions/ServerActions';

import { isNum } from '../utils/HelperFunction';

class Sidebar extends React.Component {

    handleToggleSlider = () => {
        this.props.toggleVerticalMenuAction();
    }

    render() {

        var NavMenu;

        if(this.props.headerStore.showVerticalMenu) {
            NavMenu = (
                <div>
                    <Menu.Item as={Link} exact to='/home'>
                        <Menu.Header>Home</Menu.Header>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header>Server</Menu.Header>
                        <Menu.Menu>
                            <Menu.Item as={Link} exact to='/usage'>
                                PatchGroups
                            </Menu.Item>
                            <Menu.Item as={Link} exact to='/usage' >
                                VirtualMachines
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header>Services</Menu.Header>
                        <Menu.Menu>
                            <Menu.Item as={Link} exact to='/' >
                                RolloutStatus
                            </Menu.Item>
                            <Menu.Item as={Link} exact to='/usage' >
                                VersionStatus
                            </Menu.Item>
                            <Menu.Item as={Link} exact to='/theming' >
                                HealthChecks
                            </Menu.Item>
                            <Menu.Item as={Link} exact to='/theming' >
                                Availability
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header>Loadbalancer Farms</Menu.Header>
                        <Menu.Menu>
                            <Menu.Item as={Link} exact to='/' >
                                Consistency
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header>Scom</Menu.Header>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header>Config</Menu.Header>
                        <Menu.Menu>
                            <Menu.Item as={Link} exact to='/' >
                                Loadbalancer
                            </Menu.Item>
                            <Menu.Item as={Link} exact to='/usage' >
                                ActiveDirectory
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header>Admin</Menu.Header>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header>Help</Menu.Header>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header>About</Menu.Header>
                    </Menu.Item>
                </div>
            );
        }

        return (
            <div id={this.props.headerStore.showVerticalMenu ? "verticalMenu" : "hiddenVerticalMenu"}>
                <Menu className="semanticVerticalMenu" inverted fluid vertical borderless compact >
                    <Menu.Item>
                        <HeaderSemantic inverted as='h4'>
                            <Button
                                compact={this.props.headerStore.showVerticalMenu ? false : true}
                                color="black"
                                onClick={() => this.handleToggleSlider()}
                                icon="content"
                                style={this.props.headerStore.showVerticalMenu ? { float: 'right', margin: "0px" } : { float: 'right', margin: "0px", padding: '0px' }} />
                        </HeaderSemantic>
                    </Menu.Item>
                    { NavMenu }
                </Menu>
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
