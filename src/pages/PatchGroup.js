import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getPatchGroupsAction } from '../actions/PatchGroupActions';
import { getPatchGroups } from '../requests/PatchGroupAxios';
import { Grid, Header, Segment } from 'semantic-ui-react';
import PatchGroupsBuffedTable from '../components/PatchGroupsBuffedTable';

class PatchGroup extends React.Component {

    componentDidMount() {
        getPatchGroups()
            .then(res => {
                this.props.getPatchGroupsAction(res.data)
                console.log(res.data)
            })
    }
    render() {
        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Patch groups
                        </Header>
                        <Segment attached='bottom' >
                            <PatchGroupsBuffedTable data={this.props.patchGroupStore.patchGroups} ></PatchGroupsBuffedTable>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                {/* <Grid.Row>

                </Grid.Row> */}
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
        getPatchGroupsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PatchGroup);
