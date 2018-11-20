import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';

export default class VsStatus extends Component {

    render() {
        var state = this.props.state
        return (
            <Label 
                size={this.props.size} 
                color={getAvailabiltyAndEnabledState(state.VsAvailabilityState, state.VsEnabledState)} 
                horizontal>
                {state.VsAvailabilityState | state.VsEnabledState}
            </Label>
        )
    }
}

