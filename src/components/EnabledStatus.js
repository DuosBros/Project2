import React, { memo } from 'react';
import { Label } from 'semantic-ui-react';

const EnabledStatus = (props) => {

    var state = props.status
    return (
        <Label size={props.size} color={state === 'enabled' ? 'green' : 'red'} horizontal>
            {state ? state : "no data"}
        </Label>
    )
}

export default memo(EnabledStatus);