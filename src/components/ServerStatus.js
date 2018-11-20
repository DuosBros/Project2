import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';

import { getServerState } from '../utils/HelperFunction';

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
        var state = this.props.serverState
        return (
            <Label size={this.props.size} color={this.getColor(state)} horizontal>
                {state}
            </Label>
        )
    }
}

