import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

let colors = ['#8884d8', '#82ca9d'];
const GenericPieChart = (props) => {
    return (
        <ResponsiveContainer minHeight={500} minWidth={500} >
            <PieChart width={800} height={400} margin={{ top: 5, right: 50, left: 50, bottom: 5 }} >
                <Pie dataKey="count" data={props.data}>
                    {
                        props.data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))
                    }
                </Pie>
                <Tooltip />
            </PieChart >
        </ResponsiveContainer>
    );
}

export default GenericPieChart;