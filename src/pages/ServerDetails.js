import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { getServerDetailsAction } from '../actions/ServerActions';
import { getServerDetails } from '../requests/ServerAxios';

class ServerDetails extends React.Component {
    constructor(props) {
        super(props);

        if (_.isEmpty(props.serverStore.serverDetails)) {
            getServerDetails(props.location.pathname.substring(props.location.pathname.lastIndexOf('/') + 1))
                .then(res => {
                    props.getServerDetailsAction(res.data)
                })
        }
    }

    render() {
        
        var a = this.props;
        return (
            <div>
                {this.props.serverStore.serverDetails.toString()}

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