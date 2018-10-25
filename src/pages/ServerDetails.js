import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { Grid, Header, Segment } from 'semantic-ui-react';

import { getServerDetailsAction } from '../actions/ServerActions';
import { getServerDetails } from '../requests/ServerAxios';

class ServerDetails extends React.Component {
    constructor(props) {
        super(props);

        if (_.isEmpty(props.serverStore.serverDetails)) {
            getServiceDetails(props.location.pathname.substring(props.location.pathname.lastIndexOf('/') + 1))
                .then(res => {
                    props.getServerDetailsAction(res.data)
                })
        }
    }

    render() {

        return (
            <div>

                <Grid stackable>
                    <Grid.Column>
                        <Header block attached='top' as='h4' content='Server Details' />
                        <Segment attached='bottom'>
                            argargareg
                                                        gargaergaergaerg
                        </Segment>
                    </Grid.Column>
                </Grid>
                {console.log(this.props.serverStore.serverDetails)}
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