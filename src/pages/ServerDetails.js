import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Header, Segment } from 'semantic-ui-react';

import { getServerDetailsAction } from '../actions/ServerActions';
import { getServerDetails } from '../requests/ServerAxios';

class ServerDetails extends React.Component {

    componentDidMount() {
        this.updateServer(this.props.match.params.id);
    }

    updateServer(id) {
        getServerDetails(id)
            .then(res => {
                this.props.getServerDetailsAction(res.data)
            });
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.match && this.props.match.params) {
            const params = this.props.match.params;
            if(params.id && params.id !== prevProps.match.params.id) {
                this.updateServer(this.props.match.params.id);
            }
        }
    }

    render() {
        return (
            <div>
                <Grid stackable>
                    <Grid.Column>
                        <Header block attached='top' as='h4' content='Server Details' />
                        <Segment attached='bottom'>
                            <div style={{ marginLeft: "200px"}}>{this.props.serverStore.serverDetails.ServerName}</div>
                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        serverStore: state.ServerReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getServerDetailsAction: getServerDetailsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ServerDetails);
