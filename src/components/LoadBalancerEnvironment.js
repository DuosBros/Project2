import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';

import config from '../config.json';


export default class LoadBalancerEnvironment extends Component {

    render() {
        console.log(config)
        var { loadBalancerName } = this.props
        return (
            <Label
                size={this.props.size}
                color={getAvailabiltyAndEnabledState(loadBalancerName)}
                horizontal>
                {enabledState ? enabledState : "no data"}
            </Label>
        )
    }
}

