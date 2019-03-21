import React from 'react';
import { Menu, Dropdown, Icon } from 'semantic-ui-react'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchServersAction, searchServiceShortcutAction, toggleVerticalMenuAction, toggleUserDetailsAction } from '../utils/actions';
import { searchServers, searchServiceShortcut } from '../requests/HeaderAxios';

import { isNum, debounce } from '../utils/HelperFunction';
import ShortcutFocus from '../components/ShortcutFocus';
import SearchBox from '../components/SearchBox';
import { SN_INC_SEARCH_URL, INCIDENT_PLACEHOLDER, VERSION1_PLACEHOLDER, VERSION1_SEARCH_URL } from '../appConfig';

class Header extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showMobileMenu: false
        }

        this.handleSearchServers = this.handleSearchServers.bind(this);
        this.handleSearchServiceShortcut = this.handleSearchServiceShortcut.bind(this);
        this.handleSearchServers = debounce(this.handleSearchServers, 150);
        this.handleSearchServiceShortcut = debounce(this.handleSearchServiceShortcut, 150);
    }

    handleSearchServers(value) {
        searchServers(value.trim())
            .then(res => {
                this.props.searchServersAction(res.data.map(e => ({ text: e.Name, value: e.Id })))
            })
    }

    handleServerSearchChange = (e) => {
        if (e.target.value.length > 1) {
            this.handleSearchServers(e.target.value)
        }
    }

    handleServerChange = (e, { value }) => {
        if (isNum(value)) {
            var route = "/server/" + value;
            this.props.history.push(route);
        }
    }

    handleServiceChange = (e, { value }) => {
        if (isNum(value)) {
            var route = "/service/" + value;
            this.props.history.push(route);
        }
    }

    handleSearchServiceShortcut(value) {
        searchServiceShortcut(value)
            .then(res => {
                this.props.searchServiceShortcutAction(res.data.map(e => ({ text: e.Name, value: e.Id })))
            })
    }

    handleServiceShortcutSearchChange = (e) => {
        if (e.target.value.length > 1) {
            this.handleSearchServiceShortcut(e.target.value)
        }
    }

    toggleMobileMenu = () => {
        this.setState({
            showMobileMenu: !this.state.showMobileMenu
        })
    }

    render() {

        let { isMobile } = this.props;
        let { showMobileMenu } = this.state;
        let showMenuItems, menuItems, menu;

        if (!showMobileMenu) {
            if (isMobile) {
                menuItems = (
                    <Menu.Item>
                        LeanOpsConfigurationOverview
                        <Icon name='content' style={{ cursor: 'pointer', position: 'absolute', right: '0px' }} onClick={this.toggleMobileMenu} />
                    </Menu.Item>
                )
            }
            else {
                showMenuItems = true
            }
        }
        else {
            showMenuItems = true
        }

        if (showMenuItems) {
            menuItems = (
                <>
                    <Menu.Item header onClick={() => this.props.history.push('/')}>
                        LeanOpsConfigurationOverview
                        {isMobile ? (<Icon name='content' style={{ cursor: 'pointer', position: 'absolute', right: '0px' }} onClick={this.toggleMobileMenu} />) : null}
                    </Menu.Item>
                    <Menu.Item className='headerSearchInput'>
                        <ShortcutFocus shortcut="q" focusSelector="input">
                            <Dropdown
                                icon='search'
                                selection
                                onChange={this.handleServerChange}
                                options={this.props.headerStore.searchServerResult.slice(0, 15)}
                                fluid
                                selectOnBlur={false}
                                selectOnNavigation={false}
                                placeholder='Press &apos;q&apos; to search a server'
                                value=""
                                onSearchChange={this.handleServerSearchChange}
                                search
                            />
                        </ShortcutFocus>
                    </Menu.Item>
                    <Menu.Item className='headerSearchInput'>
                        <ShortcutFocus shortcut="w" focusSelector="input">
                            <Dropdown
                                icon='search'
                                selection
                                onChange={this.handleServiceChange}
                                options={this.props.headerStore.searchServiceShortcutsResult.slice(0, 10)}
                                fluid
                                selectOnBlur={false}
                                selectOnNavigation={false}
                                placeholder='Press &apos;w&apos; to search a service'
                                value=""
                                onSearchChange={this.handleServiceShortcutSearchChange}
                                search
                            />
                        </ShortcutFocus>
                    </Menu.Item>
                    <Menu.Item className='headerSearchInput'>
                        <ShortcutFocus shortcut="e" focusSelector="input">
                            <SearchBox placeholder="Press 'e' to search in SNOW" url={SN_INC_SEARCH_URL} pattern={INCIDENT_PLACEHOLDER} />
                        </ShortcutFocus>
                    </Menu.Item>
                    <Menu.Item className='headerSearchInput'>
                        <ShortcutFocus shortcut="r" focusSelector="input">
                            <SearchBox placeholder="Press 'r' to search a v1 story" url={VERSION1_SEARCH_URL} pattern={VERSION1_PLACEHOLDER} />
                        </ShortcutFocus>
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        <Menu.Item content={this.props.baseStore.currentUser.Identity} onClick={() => this.props.toggleUserDetailsAction()} />
                    </Menu.Menu>
                </>
            )
        }

        menu = (
            <Menu stackable >
                {menuItems}
            </Menu>
        )

        return (
            <div id="header">
                {menu}
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
        searchServersAction,
        searchServiceShortcutAction,
        toggleVerticalMenuAction,
        toggleUserDetailsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
