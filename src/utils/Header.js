import React from 'react';
import { Sidebar, Menu, Segment, Icon, Input, AccordionTitle, AccordionContent, Container } from 'semantic-ui-react'
// import {browserHistory} from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';

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
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, width: "250px", position: 'fixed', top: '0px', bottom: '0px', left:'0px' }}>
            
                <Menu fluid inverted vertical borderless compact>
                    <Menu.Item>
                    {/* <Logo spaced='right' size='mini' /> */}
                    <strong>
                        LeanOpsConfigOverview
                        <small>
                        {/* <em>{version}</em> */}
                        </small>
                    </strong>
                    </Menu.Item>
                    <Menu.Item>
                    <Menu.Header>Getting Started</Menu.Header>
                    <Menu.Menu>
                        <Menu.Item  exact to='/' activeClassName='active'>
                        Introduction
                        </Menu.Item>
                        <Menu.Item  exact to='/usage' activeClassName='active'>
                        Usage
                        </Menu.Item>
                        <Menu.Item  exact to='/theming' activeClassName='active'>
                        Theming
                        </Menu.Item>
                        <Menu.Item  exact to='/layouts' activeClassName='active'>
                        Layouts
                        </Menu.Item>
                        <Menu.Item  exact to='/prototypes' activeClassName='active'>
                        Prototypes
                        </Menu.Item>
                    </Menu.Menu>
                    </Menu.Item>
                </Menu>
                
                </div>
            <div>
                
                
                
                {/* </div> */}
                                
                                {/* <div class="ui menu asd borderless" style={{borderRadius: "0 !important", border: "0", marginLeft: "250px", WebkitTransitionDuration: "0.1s"}}> */}
                                <Menu borderless style={{borderRadius: "0 !important", border: "0", marginLeft: "250px", WebkitTransitionDuration: "0.1s"}} >

                                
                                {/* <a class="item openbtn">
                                <i class="icon content"></i>
                                </a> */}
                                {/* <a class="item">Messages
                                            </a> */}
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
                                <div class="right menu">
                                <div class="ui dropdown item">
                                    ICEPOR\login <i class="dropdown icon"></i>
                                    <div class="menu">
                                    <a class="item">1</a>
                                    <a class="item">2</a>
                                    <a class="item">3</a>
                                    </div>
                                </div>
                                {/* <div class="item">
                                    <div class="ui primary button">Sign Up</div>
                                </div> */}
                                </div>
                            
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
export default Header;