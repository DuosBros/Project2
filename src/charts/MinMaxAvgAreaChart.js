import React from 'react';
import { Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, LineChart, Line } from 'recharts';

const DEFAULT_FROM_Y_AXIS = 0;
const DEFAULT_TO_Y_AXIS = 100;

class MinMaxAvgAreaChart extends React.Component {

    render() {
        let defaultFromYAxis = DEFAULT_FROM_Y_AXIS;
        if (this.props.hasOwnProperty("fromYAxis")) {
            if (typeof this.props.fromYAxis !== "number" && typeof this.props.fromYAxis !== "string") {
                throw new Error("fromYAxis property must be a number or string.")
            }
            defaultFromYAxis = this.props.fromYAxis;
        }


        let defaultToYAxis = DEFAULT_TO_Y_AXIS;
        if (this.props.hasOwnProperty("toYAxis")) {
            if (typeof this.props.toYAxis !== "number" && typeof this.props.toYAxis !== "string") {
                throw new Error("toYAxis property must be a number or string.")
            }
            defaultToYAxis = this.props.toYAxis;
        }

        return (
            <ResponsiveContainer height={125}>
                <ComposedChart data={this.props.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[defaultFromYAxis, defaultToYAxis]} />
                    <Tooltip />
                    <Area type='monotone' dataKey='Min-Max' stroke='#8884d8' fill='#8884d8' />
                    <Line type="monotone" dataKey="avg" stroke="#ff0000" />
                </ComposedChart>
            </ResponsiveContainer>
        );
    }
}

export default MinMaxAvgAreaChart;
