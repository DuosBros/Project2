import React from 'react';
import { Menu, Segment, Container, Icon, Dropdown } from 'semantic-ui-react'
// import {browserHistory} from 'react-router';
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
            
                <Menu inverted>
                    <Menu.Item  name='LeanOpsConfigOverview' />
                </Menu>
            
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