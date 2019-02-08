import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const DEFAULT_FILTER_ZERO_COUNT = false;

class GenericBarChart extends React.Component {

    render() {
        let filterZeroCount = DEFAULT_FILTER_ZERO_COUNT;
        if (this.props.hasOwnProperty("filterZeroCount")) {
            if (typeof this.props.filterZeroCount !== "boolean") {
                throw new Error("filterZeroCount property must be a bool.")
            }
            filterZeroCount = this.props.filterZeroCount;
        }

        return (
            <ResponsiveContainer minHeight={250} minWidth={800} >
                <BarChart layout='vertical' data={filterZeroCount ? this.props.data.filter(x => x.count !== 0) : this.props.data}
                    margin={{ top: 5, right: 180, left: 150, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="count" type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        );
    }
}

export default GenericBarChart;
