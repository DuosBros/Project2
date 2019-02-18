import React from 'react';
const RawDataRow = (props) => {
    if (props.stack) {

        var result;
        result = (
            <dl className="dl-horizontal">
                <dt style={props.rawDataStyle ? props.rawDataStyle.dt : {}}>{props.x.name}</dt>
                {
                    props.stack.map((x, i) => {
                        return (
                            <React.Fragment key={i}>
                                <dd style={props.rawDataStyle ? props.rawDataStyle.dd : {}}>{x + ": " + props.x[x]}</dd>
                            </React.Fragment>
                        )
                    })}
            </dl>
        )

        return result;
    }
    else {
        return (
            <dl className="dl-horizontal">
                <dt style={props.rawDataStyle ? props.rawDataStyle.dt : {}}>{props.x.name}</dt>
                <dd style={props.rawDataStyle ? props.rawDataStyle.dd : {}}>{props.x.count}</dd>
            </dl>
        );
    }
}

export default RawDataRow;