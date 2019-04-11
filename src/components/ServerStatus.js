import React, { memo } from 'react';
import { Label } from 'semantic-ui-react';

const ServerStatus = (props) => {

    const getColor = (state) => {
        if (state === 'online') {
            return 'green'
        }
        else if (state === 'not reachable') {
            return 'grey'
        }
        else {
            return 'red'
        }

    }

    var state = props.serverState ? props.serverState : "No Data"
    return (
        <Label size={props.size} color={getColor(state)} horizontal>
            {state}
        </Label>
    )
}

export default memo(ServerStatus);

