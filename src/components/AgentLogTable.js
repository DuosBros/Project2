import React from 'react'
import GenericTable from './GenericTable';

export default class AgentLogTable extends React.PureComponent {
    columns = [
        {
            name: "Agent Name",
            prop: "AgentName",
            collapsing: true
        },
        {
            name: "Service User",
            prop: "ServiceUser",
            collapsing: true
        },
        {
            name: "Client",
            prop: "Client",
            collapsing: true
        },
        {
            name: "LastRun",
            prop: "LastRun",
            collapsing: true
        },
        {
            name: "Success",
            prop: "Success",
            collapsing: true
        },
        {
            name: "Duration",
            prop: "Duration",
            collapsing: true
        },
        {
            name: "StartTime",
            prop: "StartTimeUTC",
            collapsing: true
        },
        {
            name: "EndTime",
            prop: "EndTimeUTC",
            collapsing: true
        }
    ]

    render() {
        return (<GenericTable columns={this.columns} {...this.props} />);
    }
}
