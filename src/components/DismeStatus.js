import React from 'react';
import { Label } from 'semantic-ui-react';

const DismeStatus = (props) => {

        var state = props.dismeStatus
        return (
            <Label size={props.size} color={state === 'active' ? 'green' : 'red'} horizontal>
                {state}
            </Label>
        )
}

export default DismeStatus;
