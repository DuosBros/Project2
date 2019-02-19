import React from 'react';
import { Label } from 'semantic-ui-react';

const AvailabilityStatus = (props) => {

    var state = props.status
    return (
        <Label size={props.size} color={state === 'available' ? 'green' : 'red'} horizontal>
            {state ? state : "no data"}
        </Label>
    )
}

export default AvailabilityStatus;