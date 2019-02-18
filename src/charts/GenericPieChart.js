import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_COLORS } from '../appConfig';

const GenericPieChart = (props) => {
    return (
        <ResponsiveContainer minHeight={500} minWidth={500} >
            <PieChart width={800} height={400} margin={{ top: 5, right: 50, left: 50, bottom: 5 }} >
                <Pie dataKey="count" data={props.data}>
                    {
                        props.data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))
                    }
                </Pie>
                <Tooltip />
            </PieChart >
        </ResponsiveContainer>
    );
}

export default GenericPieChart;