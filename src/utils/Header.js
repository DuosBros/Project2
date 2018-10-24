import React from 'react';
import keyboardKey from 'keyboard-key'
import { Sidebar, Menu, Segment, Icon, Button, Header as HeaderSemantic, Dropdown, Ref } from 'semantic-ui-react'
// import { Link, withRouter } from 'react-static';
import { Link, withRouter } from 'react-router-dom';

import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchServersAction, searchServiceShortcutAction, toggleVerticalMenuAction } from '../actions/HeaderActions';
import { searchServers, searchServiceShortcut } from '../requests/HeaderAxios';

import { isNum } from '../utils/HelperFunction';

class Header extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            serverQuery: '',
            serviceShortcutQuery: ''
        }

    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleDocumentKeyDown)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleDocumentKeyDown)
    }

    handleDocumentKeyDown = (e) => {
        const isq = keyboardKey.getKey(e) === 'q'
        const isw = keyboardKey.getKey(e) === 'w'
        const hasModifier = e.altKey || e.ctrlKey || e.metaKey
        const bodyHasFocus = document.activeElement === document.body

        if (!hasModifier && isq && bodyHasFocus) { this._searchServerInput.focus(); e.preventDefault(); }
        if (!hasModifier && isw && bodyHasFocus) { this._searchServiceShortcutInput.focus(); e.preventDefault(); }
    }

    handleSearchServerChange = (e) => {
        this.setState({
            serverQuery: e.target.value
        })

        if (e.target.value.length > 1) {
            searchServers(e.target.value)
                .then(res => {
                    this.props.searchServersAction(res.data.map(e => ({ text: e.Name, value: e.Id })))
                })
        }
    }
    
    handleSearchServerSelect = (e, { value }) => {
        if (!isNum(value)) {
            this.setState({ serverQuery: value })
        }
    }

    handleSearchServerClose = (e, { value }) => {

        this.setState({
            serverQuery: value
        })

        if (isNum(value)) {
            var route = "/server/details/" + this.state.serverQuery
            this.props.history.push(route)
        }
    }

    handleSearchServiceShortcutChange = (e) => {
        this.setState({
            serviceShortcutQuery: e.target.value
        })

        if (e.target.value.length > 1) {
            searchServiceShortcut(e.target.value)
                .then(res => {
                    this.props.searchServiceShortcutAction(res.data.map(e => ({ text: e.Name, value: e.Id })))
                })
        }
    }

    handleSearchServiceShortcutSelect = (e, { value }) => {
        this.setState({ serviceShortcutQuery: value })
    }

    handleSearchServiceShortcutClose = (e, { value }) => {
        
        if (isNum(value)) {
            var route = "/service/details/" + this.state.serviceShortcutQuery
            this.props.history.push(route)
        }
    }

    handleSearchServerRef = (c) => {
        this._searchServerInput = c && c.querySelector('input')
    }

    handleSearchServiceShortcutRef = (c) => {
        this._searchServiceShortcutInput = c && c.querySelector('input')
    }

    handleToggleSlider = () => {
        this.props.toggleVerticalMenuAction();
    }

    render() {
        return (
            <div id="header">
                {

                    <div id={this.props.headerStore.showVerticalMenu ? "verticalMenu" : "hiddenVerticalMenu"}>
                        <Menu className="semanticVerticalMenu" inverted fluid vertical borderless compact >
                            <Menu.Item>
                                <HeaderSemantic inverted as='h4'>
                                    {this.props.headerStore.showVerticalMenu ? "LeanOpsConfigOverview" : ""}
                                    <Button
                                        compact={this.props.headerStore.showVerticalMenu ? false : true}
                                        color="black"
                                        onClick={() => this.handleToggleSlider()}
                                        icon="content"
                                        style={this.props.headerStore.showVerticalMenu ? { float: 'right', margin: "0px" } : { float: 'right', margin: "0px", padding: '0px' }} />
                                </HeaderSemantic>
                            </Menu.Item>
                            {
                                this.props.headerStore.showVerticalMenu ? (
                                    <div>
                                        <Menu.Item>
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
                                ) : (
                                        <div></div>
                                    )
                            }
                        </Menu>
                    </div>

                }

                <div id="menuId">
                    <Menu stackable >
                        <Menu.Item className='headerSearchInput'>
                            <Ref innerRef={this.handleSearchServerRef}>
                                <Dropdown
                                    icon='search'
                                    selection
                                    onClose={this.handleSearchServerClose}
                                    onChange={this.handleSearchServerSelect}
                                    options={this.props.headerStore.searchServerResult.slice(0, 15)}
                                    fluid
                                    placeholder='Press &apos;q&apos; to search a server'
                                    value={this.state.serverQuery}
                                    onSearchChange={this.handleSearchServerChange}
                                    search
                                />
                            </Ref>
                        </Menu.Item>
                        <Menu.Item className='headerSearchInput'>
                            <Ref innerRef={this.handleSearchServiceShortcutRef}>
                                <Dropdown
                                    icon='search'
                                    selection
                                    onClose={this.handleSearchServiceShortcutClose}
                                    onChange={this.handleSearchServiceShortcutSelect}
                                    options={this.props.headerStore.searchServiceShortcutsResult.slice(0, 15)}
                                    fluid
                                    placeholder='Press &apos;w&apos; to search a service shortcut'
                                    value={this.state.serviceShortcutQuery}
                                    onSearchChange={this.handleSearchServiceShortcutChange}
                                    search
                                />
                            </Ref>

                        </Menu.Item>
                        <Menu.Menu position='right'>
                            <Dropdown item text={this.props.baseStore.currentUser.Identity}>
                                <Dropdown.Menu>
                                    <Dropdown.Item>
                                        1
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        2
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        3
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Menu>
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
        searchServersAction: searchServersAction,
        searchServiceShortcutAction: searchServiceShortcutAction,
        toggleVerticalMenuAction: toggleVerticalMenuAction
    }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
