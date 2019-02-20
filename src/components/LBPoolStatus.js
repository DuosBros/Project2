import React from 'react';
import { Label } from 'semantic-ui-react';
import { getAvailabiltyAndEnabledState } from '../utils/HelperFunction';

const LBPoolStatus = (props) => {

    var { availabilityState, enabledState } = props
    return (
        <>
            <Label
                size={props.size}
                color={getAvailabiltyAndEnabledState(availabilityState, enabledState)}
                horizontal>
                {availabilityState ? availabilityState : "no data"}
            </Label>
            <Label
                size={props.size}
                color={getAvailabiltyAndEnabledState(availabilityState, enabledState)}
                horizontal>
                {enabledState ? enabledState : "no data"}
            </Label>
        </>
    )
}

export default LBPoolStatus;