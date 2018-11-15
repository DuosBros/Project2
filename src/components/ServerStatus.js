import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';

import { getServerState } from '../utils/HelperFunction';

export default class ServerStatus extends Component {

    render() {
        var state = getServerState(this.props.serverStateId);
        return (
            <Label color={state === "online" ? 'green' : 'red'} horizontal>
                {state}
            </Label>
        )
    }
}

