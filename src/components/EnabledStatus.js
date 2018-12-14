import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';

export default class EnabledStatus extends Component {

    render() {
        var state = this.props.status
        return (
            <Label size={this.props.size} color={state === 'enabled' ? 'green' : 'red'} horizontal>
                {state ? state : "no data"}
            </Label>
        )
    }
}

