import React from 'react';
import keyboardKey from 'keyboard-key'
import { Menu, Dropdown, Ref } from 'semantic-ui-react'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchServersAction, searchServiceShortcutAction, toggleVerticalMenuAction, toggleUserDetailsAction } from '../actions/HeaderActions';
import { searchServers, searchServiceShortcut } from '../requests/HeaderAxios';

import { isNum, debounce } from '../utils/HelperFunction';

class Header extends React.Component {

    constructor(props) {
        super(props);

        this.handleSearchServers = this.handleSearchServers.bind(this);
        this.handleSearchServers = debounce(this.handleSearchServers, 250);
    }

    state = {
        serviceShortcutQuery: ''
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

    handleSearchServers(value) {
        searchServers(value)
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

    handleServiceShortcutSearchChange = (e) => {

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

    handleSearchServerRef = (c) => {
        this._searchServerInput = c && c.querySelector('input')
    }

    handleSearchServiceShortcutRef = (c) => {
        this._searchServiceShortcutInput = c && c.querySelector('input')
    }

    render() {
        return (
            <div id="header">
                <Menu stackable >
                    <Menu.Item header content='LeanOpsConfigurationOverview' onClick={() => this.props.history.push('/')} />
                    <Menu.Item className='headerSearchInput'>
                        <Ref innerRef={this.handleSearchServerRef}>
                            <Dropdown
                                icon='search'
                                selection
                                onChange={this.handleServerChange}
                                options={this.props.headerStore.searchServerResult.slice(0, 15)}
                                fluid
                                selectOnNavigation={false}
                                placeholder='Press &apos;q&apos; to search a server'
                                value=""
                                onSearchChange={this.handleServerSearchChange}
                                search
                            />
                        </Ref>
                    </Menu.Item>
                    <Menu.Item className='headerSearchInput'>
                        <Ref innerRef={this.handleSearchServiceShortcutRef}>
                            <Dropdown
                                icon='search'
                                selection
                                onChange={this.handleServiceChange}
                                options={this.props.headerStore.searchServiceShortcutsResult.slice(0, 10)}
                                fluid
                                selectOnNavigation={false}
                                placeholder='Press &apos;w&apos; to search a server'
                                value=""
                                onSearchChange={this.handleServiceShortcutSearchChange}
                                search
                            />
                        </Ref>

                    </Menu.Item>
                    <Menu.Menu position='right'>
                        <Menu.Item content={this.props.baseStore.currentUser.Identity} onClick={() => this.props.toggleUserDetailsAction()} />
                    </Menu.Menu>
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
        searchServersAction,
        searchServiceShortcutAction,
        toggleVerticalMenuAction,
        toggleUserDetailsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
