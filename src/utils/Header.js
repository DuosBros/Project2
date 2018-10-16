import React from 'react';
import keyboardKey from 'keyboard-key'
import { Sidebar, Menu, Segment, Icon, Input, Header as HeaderSemantic, Dropdown, Ref } from 'semantic-ui-react'
import { Link, withRouter } from 'react-static'

// import {browserHistory} from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import {loginFailedAction} from '../pages/login/LoginAction';

class Header extends React.Component {
    constructor(props) {
        super(props)

        // this.logout = this.logout.bind(this);

        // var currentPath = browserHistory.getCurrentLocation().pathname.replace("/","");

        // if(currentPath !== 'patients' && currentPath !== 'graphs') {
        //     currentPath = 'patients'
        // }
        this.state = {
            query: ''
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
        // const isw = keyboardKey.getKey(e) === 'w' 
        const hasModifier = e.altKey || e.ctrlKey || e.metaKey
        const bodyHasFocus = document.activeElement === document.body

        if (!hasModifier && isq && bodyHasFocus) this._searchInput.focus()
    }

    handleSearchChange = (e) => {
        // ignore first "/" on search focus
        if (e.target.value === 'q' && e.target.value.length === 1) return

        this.setState({
            selectedItemIndex: 0,
            query: e.target.value,
        })
    }

    handleSearchRef = (c) => {
        this._searchInput = c && c.querySelector('input')
    }

    render() {
        // const { activeItem } = this.state

        return (
            <div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, width: "260px", position: 'fixed', height: '100%' }}>
                    <Menu inverted fluid vertical borderless compact style={{ borderRadius: '0px', height: '100%' }}>
                        <Menu.Item>
                            <HeaderSemantic inverted as='h4'>LeanOpsConfigOverview</HeaderSemantic>
                        </Menu.Item>
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
                                <Menu.Item as={Link} exact to='/theming' >
                                    Statistics
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
                                <Menu.Item as={Link} exact to='/theming' >
                                    Statistics
                                </Menu.Item>
                            </Menu.Menu>
                        </Menu.Item>
                        <Menu.Item>
                            <Menu.Header>Loadbalancer Farms</Menu.Header>
                            <Menu.Menu>
                                <Menu.Item as={Link} exact to='/' >
                                    Consistency
                                </Menu.Item>
                                <Menu.Item as={Link} exact to='/usage' >
                                    Statistics
                                </Menu.Item>
                                <Menu.Item as={Link} exact to='/theming' >
                                    Graphs
                                </Menu.Item>
                            </Menu.Menu>
                        </Menu.Item>
                        <Menu.Item>
                            <Menu.Header>Ip</Menu.Header>
                        </Menu.Item>
                        <Menu.Item>
                            <Menu.Header>Scom</Menu.Header>
                        </Menu.Item>
                        <Menu.Item>
                            <Menu.Header>BAWLogServer</Menu.Header>
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
                                <Menu.Item as={Link} exact to='/theming' >
                                    Tags
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
                    </Menu>
                </div>

                <div>
                    <Menu inverted stackable style={{ borderRadius: "0px", border: "0", marginLeft: "250px", WebkitTransitionDuration: "0.1s" }} >
                        <Menu.Item>
                            <Ref innerRef={this.handleSearchRef}>
                                <Input
                                    // fluid
                                    // icon={{ name: 'filter', color: 'teal', inverted: true, bordered: true }}
                                    placeholder='Press "q" to search a server'
                                    value={this.state.query}
                                    onChange={this.handleSearchChange}

                                />
                            </Ref>
                        </Menu.Item>
                        <Menu.Item>
                            <Input placeholder='Press "w" to search a service shortcut' />
                        </Menu.Item>
                        <Menu.Menu position='right'>
                            <Dropdown item text='ICEPOR\login'>
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

// function mapStateToProps(state) {
//     return {
//         loginPageStore: state.LoginReducer
//     };
//   }

// function mapDispatchToProps(dispatch) {
//     return bindActionCreators({
//         loginFailedAction : loginFailedAction
//     }, dispatch);
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Header);
export default withRouter(Header);