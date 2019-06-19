import React, { memo } from 'react';
import { Label, Popup } from 'semantic-ui-react';
import { contains } from '../utils/HelperFunction';

const HealthLabel = (props) => {

    let color, label;

    if (props.health.status === "rejected") {
        color = 'gray'
        label = (
            <Popup trigger={
                <Label content="Failed" color={color} horizontal />
            } content={props.health.e.message} inverted />
        )
    }
    else {
        if (contains(props.health.res, "CHECK_OK")) {
            color = 'green';
        }
        else {
            color = 'red'
        }

        label = (
            <Label color={color} className="labelOnClick" horizontal onClick={() =>
                window.open(props.health.url)}>
                CHECK_OK
            </Label>
        )
    }

    return (
        <>
            {label}
        </>
    )
}

export default memo(HealthLabel);

