import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Segment } from 'semantic-ui-react';

class Admin extends React.Component {

    render() {
        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Admin
                        </Header>
                        <Segment attached='bottom' >
                            Coming soon
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

function mapStateToProps(state) {
    return {
        patchGroupStore: state.PatchGroupReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // getPatchGroupsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
