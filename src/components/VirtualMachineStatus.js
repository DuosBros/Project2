import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';

export default class VirtualMachineStatus extends Component {

    render() {
        var state = this.props.status
        return (
            <Label size={this.props.size} color={state.toString().search(new RegExp("running", "i")) >= 0 ? 'green' : 'red'} horizontal>
                {state}
            </Label>
        )
    }
}

