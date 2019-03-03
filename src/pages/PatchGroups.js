import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { getPatchGroupsAction } from '../actions/PatchGroupActions';
import { getPatchGroups } from '../requests/PatchGroupAxios';
import { Grid, Header, Segment, Message, Icon } from 'semantic-ui-react';
import PatchGroupsTable from '../components/PatchGroupsTable';
import ErrorMessage from '../components/ErrorMessage';
import { APP_TITLE } from '../appConfig';

class PatchGroups extends React.Component {

    componentDidMount() {
        this.fetchPatchGroupsAndHandleResult()

        document.title = APP_TITLE + "Patchgroups"
    }

    fetchPatchGroupsAndHandleResult = () => {
        getPatchGroups()
            .then(res => {
                this.props.getPatchGroupsAction({ success: true, data: res.data })
            })
            .catch(err => {
                this.props.getPatchGroupsAction({ success: false, error: err })
            })
    }

    render() {

        // in case of error
        if (!this.props.patchGroupStore.patchGroups.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header block attached='top' as='h4'>
                                Patch groups
                        </Header>
                            <Segment attached='bottom' >
                                <ErrorMessage handleRefresh={this.fetchPatchGroupsAndHandleResult} error={this.props.patchGroupStore.patchGroups.error} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        // in case it's still loading data
        if (_.isEmpty(this.props.patchGroupStore.patchGroups.data)) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Fetching patch groups</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            )
        }

        // render page
        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            Patch groups
                        </Header>
                        <Segment attached='bottom' >
                            <PatchGroupsTable compact="very" rowsPerPage={45} data={this.props.patchGroupStore.patchGroups.data} />
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
        getPatchGroupsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PatchGroups);
