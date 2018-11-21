import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';
import { getAvailabiltyAndEnabledState } from '../utils/HelperFunction';


export default class VsStatus extends Component {

    render() {
        var state = this.props.state
        return (
            <Label 
                size={this.props.size} 
                color={getAvailabiltyAndEnabledState(state.VsAvailabilityState, state.VsEnabledState)} 
                horizontal>
                {state.VsAvailabilityState ? state.VsAvailabilityState : "no data"} <br/> {state.VsEnabledState ? state.VsEnabledState : "no data"}
            </Label>
        )
    }
}

