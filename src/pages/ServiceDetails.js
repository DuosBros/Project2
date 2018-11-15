import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { getServiceDetailsAction } from '../actions/ServiceActions';
import { getServiceDetails } from '../requests/ServiceAxios';

class ServiceDetails extends React.Component {
    constructor(props) {
        super(props);

        
    }

    componentDidMount() {
        this.updateService(this.props.match.params.id);
    }

    updateService(id) {
        getServiceDetails(id)
        .then(res => {
            this.props.getServiceDetailsAction(res.data)
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.match && this.props.match.params) {
            const params = this.props.match.params;
            if (params.id && params.id !== prevProps.match.params.id) {
                this.updateService(this.props.match.params.id);
            }
        }
    }

    render() {
        console.log(this.props.serviceStore.serviceDetails)

        var serviceDetails = this.props.serviceStore.serviceDetails;

        return (
            <div>
                Service details: {JSON.stringify(this.props.serviceStore.serviceDetails)}
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