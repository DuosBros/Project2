import React from 'react';
import { Label } from 'semantic-ui-react';
import { getAvailabiltyAndEnabledState } from '../utils/HelperFunction';


const VsStatus = (props) => {

    var { availabilityState, enabledState } = props
    return (
        <React.Fragment>
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
        </React.Fragment>
    )
}

export default VsStatus;