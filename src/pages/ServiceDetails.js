import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { getServiceDetailsAction } from '../actions/ServiceActions';
import { getServiceDetails } from '../requests/ServiceAxios';

class ServiceDetails extends React.Component {
    constructor(props) {
        super(props);

        if (_.isEmpty(props.serviceStore.serviceDetails)) {
            getServiceDetails(props.location.pathname.substring(props.location.pathname.lastIndexOf('/') + 1))
                .then(res => {
                    props.getServiceDetailsAction(res.data)
                })
        }
    }

    componentWillReceiveProps(newProps) {
        
    }

    render() {
        return (
            <div>
                Service details: {this.props.location.pathname.substring(this.props.location.pathname.lastIndexOf('/') + 1)}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        serviceStore: state.ServiceReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getServiceDetailsAction: getServiceDetailsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceDetails);