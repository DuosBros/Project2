import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';
import { getAvailabiltyAndEnabledState } from '../utils/HelperFunction';


export default class VsStatus extends Component {

    render() {
        var { availabilityState, enabledState } = this.props
        return (
            <React.Fragment>
                <Label
                    size={this.props.size}
                    color={getAvailabiltyAndEnabledState(availabilityState, enabledState)}
                    horizontal>
                    {availabilityState ? availabilityState : "no data"}
                </Label>
                <Label
                    size={this.props.size}
                    color={getAvailabiltyAndEnabledState(availabilityState, enabledState)}
                    horizontal>
                    {enabledState ? enabledState : "no data"}
                </Label>
            </React.Fragment>
        )
    }
}

