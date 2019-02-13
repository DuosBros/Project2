import React from 'react';
const RawDataRow = (props) => {
    return (
        <dl className="dl-horizontal">
            <dt>{props.x.name}</dt>
            <dd>{props.x.count}</dd>
        </dl>
    );
}

export default RawDataRow;