import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

class GenericBarChart extends React.Component {

    render() {

        return (
            <ResponsiveContainer minHeight={230} minWidth={800} >
                <BarChart layout='vertical' data={this.props.data}
                    margin={{ top: 5, right: 50, left: 50, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="count" type="number" />
                    <YAxis width={250} type="category" dataKey="name">
                    </YAxis>
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        );
    }
}

export default GenericBarChart;
