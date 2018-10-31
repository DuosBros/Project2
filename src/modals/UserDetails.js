import React from 'react';
import { Button, Modal, Dropdown } from 'semantic-ui-react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import {toggleUserDetailsAction} from '../actions/HeaderActions';

class UserDetails extends React.Component {

    render() {
        
        console.log(this.props.userDetails)
        return (
            <Modal
                size='mini'
                open={this.props.show}
                closeOnEscape={true}
                closeOnDimmerClick={false}
                closeIcon={true}
                onClose={() => this.props.toggleUserDetailsAction()}
            >
            <Modal.Header>User Details</Modal.Header>
            <Modal.Content>
                
            </Modal.Content>
            <Modal.Actions>
              {/* <Button onClick={() => this.props.toggleUserDetailsAction()} style=
              {{backgroundColor: '#9a3334', color:'white'}} content='Back' /> */}
              <Button
                onClick={() => this.props.toggleUserDetailsAction()}
                positive
                labelPosition='right'
                icon='checkmark'
                content='Uložit'
                style={{backgroundColor: '#9a3334', color:'white'}}
              />
            </Modal.Actions>
          </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        headerStore: state.HeaderReducer
    };
  }
  
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleUserDetailsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);