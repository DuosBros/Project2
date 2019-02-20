import GenericTable from './GenericTable';

export default class WindowsServicesTable extends GenericTable {
    getColumns() {
        return [
            {
                name: "Service Name",
                prop: "ServiceName",
                collapsing: true
            },
            {
                name: "Display Name",
                prop: "DisplayName",
                collapsing: true
            },
            {
                name: "StartupType",
                prop: "StartupType",
                collapsing: true
            },
            {
                name: "State",
                prop: "State",
                styleProp: "StateAlert",
                collapsing: true
            },
            {
                name: "User",
                prop: "User",
                collapsing: true
            }
        ];
    }
}
