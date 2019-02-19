import React from 'react';
import { Label } from 'semantic-ui-react';

const VirtualMachineStatus = (props) => {

    var state = props.status
    return (
        <Label size={props.size} color={state.toString().search(new RegExp("running", "i")) >= 0 ? 'green' : 'red'} horizontal>
            {state}
        </Label>
    )
}

export default VirtualMachineStatus;

