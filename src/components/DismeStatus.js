import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';

import { getDismeState } from '../utils/HelperFunction';

export default class DismeStatus extends Component {

    render() {
        var state = getDismeState(this.props.dismeStatus );
        return (
            <Label color={state === 'active' ? 'green' : 'red'} horizontal>
                {state}
            </Label>
        )
    }
}

