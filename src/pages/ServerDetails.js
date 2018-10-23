import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { Message } from 'semantic-ui-react';

import { getServerDetailsAction } from '../actions/ServerActions';
import { getServiceDetails } from '../requests/ServerAxios';

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
                Server details shit and fuck
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