import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';

export default class AvailabilityStatus extends Component {

    render() {
        var state = this.props.status
        return (
            <Label size={this.props.size} color={state === 'available' ? 'green' : 'red'} horizontal>
                {state ? state : "no data"}
            </Label>
        )
    }
}
