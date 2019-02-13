import React from 'react';
const RawDataRow = (props) => {
    return (
        <dl className="dl-horizontal">
            <dt style={props.rawDataStyle.dt}>{props.x.name}</dt>
            <dd style={props.rawDataStyle.dd}>{props.x.count}</dd>
        </dl>
    );
}

export default RawDataRow;