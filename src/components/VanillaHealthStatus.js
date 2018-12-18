import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';

export default class VanillaHealthStatus extends Component {

    render() {
        var state = this.props.status;
        var color;

        if (state[0] === "warning") {
            color = 'orange'
        }
        else if (state[0] === "success") {
            color = 'green'
        }
        else {
            color = 'red'
        }
        
        return (
            <Label size={this.props.size} color={color} horizontal>
                {state[1] ? state[1] : "no data"}
            </Label>
        )
    }
}

