import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';
import { getAvailabiltyAndEnabledState } from '../utils/HelperFunction';

export default class LoadBalancerEnvironment extends Component {

    render() {
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
