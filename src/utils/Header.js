import React from 'react';
import { Sidebar, Menu, Segment, Icon, Input, Header as HeaderSemantic, Dropdown, Container } from 'semantic-ui-react'
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
        // this.state = {
        //     activeItem: currentPath
        // }
    }

    // componentDidMount() {
    //     var currentPath = browserHistory.getCurrentLocation().pathname.replace("/","");

    //     if(currentPath !== 'patients' && currentPath !== 'graphs') {
    //         currentPath = 'patients'
    //     }

    //     this.setState({ activeItem: currentPath })
    // }

    // handleItemClick = (e, { name }) => 
    // {
    //     if(name !== 'FNO - Urgent') {
    //         this.setState({ activeItem: name })
    //     }

    //     if(name === 'FNO - Urgent') {
    //         browserHistory.push('/patients');
    //         window.location.reload()
    //     }

    //     if(name === 'patients') {
    //         browserHistory.push('/patients');
    //     }

    //     if(name === 'graphs') {
    //         browserHistory.push('/graphs');
    //         window.location.reload()
    //     }

    // }

    // logout() {
    //     this.props.loginFailedAction();
    //     this.setState({ activeItem: "" })
    //     browserHistory.push('/logout');
    // }


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
                            <Input
                                // fluid
                                // icon={{ name: 'filter', color: 'teal', inverted: true, bordered: true }}
                                placeholder='Search Server'
                            // value={query}
                            // onChange={this.handleSearchChange}
                            // onKeyDown={this.handleSearchKeyDown}
                            />
                        </Menu.Item>
                        <Menu.Item>
                            <Input placeholder='Search ServiceShortcut' />
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