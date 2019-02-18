import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { CHART_COLORS } from '../appConfig';

const GenericBarChart = (props) => {
    var bar;
    if (props.stack) {

        bar = props.stack.map((x, i) => {
            return <Bar key={i} dataKey={x} stackId="a" fill={CHART_COLORS[i % CHART_COLORS.length]} />
        })
    }
    else {
        bar = <Bar dataKey="count" fill={CHART_COLORS[0]} />
    }
    return (
        <ResponsiveContainer minHeight={230} minWidth={800} >
            <BarChart layout='vertical' data={props.data}
                margin={{ top: 5, right: 50, left: 50, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={props.stack ? null : "count"} type="number" />
                <YAxis width={250} type="category" dataKey="name">
                </YAxis>
                <Tooltip />
                {bar}
            </BarChart>
        </ResponsiveContainer>
    );
}

export default GenericBarChart;
