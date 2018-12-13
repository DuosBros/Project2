import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';

export default class ServerStatus extends Component {

    getColor = (state) => {
        if(state === 'online') {
            return 'green'
        }
        else if(state === 'not reachable') {
            return 'grey'
        }
        else {
            return 'red'
        }
    
    }

    render() {
        var state = this.props.serverState ? this.props.serverState : "No Data"
        return (
            <Label size={this.props.size} color={this.getColor(state)} horizontal>
                {state}
            </Label>
        )
    }
}

