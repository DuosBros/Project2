import GenericTable from './GenericTable';

export default class PatchGroupsTable extends GenericTable {
    getColumns() {
        return [
            {
                name: "ID",
                prop: "Id",
                width: 1
            },
            {
                name: "Name",
                prop: "Name",
                width: 4,
                collapsing: true
            },
            {
                name: "AD Path",
                prop: "ADPATH",
                width: 4,
                collapsing: true
            },
            {
                name: "Country",
                prop: "Country",
                width: 1
            },
            {
                name: "Stage",
                prop: "Stage",
                width: 2
            },
            {
                name: "Main Patch Group",
                prop: "MemberOfGroup",
                width: 3
            },
            {
                name: "# Servers",
                prop: "ServerCount",
                width: 1,
                collapsing: true
            }
        ];
    }
}
