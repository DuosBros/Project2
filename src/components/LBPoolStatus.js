import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';
import { getAvailabiltyAndEnabledState } from '../utils/HelperFunction';

export default class LBPoolStatus extends Component {

    render() {
        var state = this.props.state
        return (
            <Label 
                size={this.props.size} 
                color={getAvailabiltyAndEnabledState(state.PoolAvailabilityState, state.PoolEnabledState)} 
                horizontal>
                {state.PoolAvailabilityState | state.PoolEnabledState}
            </Label>
        )
    }
}

