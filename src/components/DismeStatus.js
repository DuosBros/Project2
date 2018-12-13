import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';

export default class DismeStatus extends Component {

    render() {
        var state = this.props.dismeStatus
        return (
            <Label size={this.props.size} color={state === 'active' ? 'green' : 'red'} horizontal>
                {state}
            </Label>
        )
    }
}

