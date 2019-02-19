import React from 'react';
import { Label, Popup } from 'semantic-ui-react';

const VanillaHealthStatus = (props) => {

    var state = props.status;
    var color;

    if (state[0] === "warning") {
        color = 'orange'
    }
    else if (state[0] === "success") {
        color = 'green'
    }
    else {
        color = 'red'
    }

    return (
        <>
            {
                state[1].toLowerCase() === "check_ok" ? (
                    <Popup trigger={
                        <Label style={{ cursor: 'pointer' }} size={props.size} color={color} horizontal onClick={() =>
                            window.open(props.url)}>
                            {state[1] ? state[1] : "no data - refresh"}
                        </Label>
                    } content='Go to healthcheck' inverted />
                ) : (
                        <Label size={props.size} color={color} horizontal>
                            {state[1] ? state[1] : "no data - refresh"}
                        </Label>
                    )
            }
        </>
    )
}

export default VanillaHealthStatus;

