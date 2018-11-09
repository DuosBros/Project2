import _ from 'lodash'
import React, { Component } from 'react'
import { Table, Button } from 'semantic-ui-react'
import moment from 'moment';

export default class SCOMSegment extends Component {

    state = {
        showScomModal: false
    }



    render() {

        var data = this.props.data;
        var mappedData, tableHeader, tableBody;

        if (data.length > 1) {

            tableHeader = (
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell width={2} content='Alert Name' />
                        <Table.HeaderCell width={5} content='Alert Description' />
                        <Table.HeaderCell width={4} content='Note' />
                    </Table.Row>
                </Table.Header>
            )

            mappedData = data.map(alert => {
                return (
                    <Table.Row key={alert.AlertGuid}>
                        <Table.Cell >{alert.AlertName}</Table.Cell>
                        <Table.Cell >{alert.AlertDescription}</Table.Cell>
                        <Table.Cell>{alert.TicketId}</Table.Cell>

                    </Table.Row>
                )
            })

            tableBody = (
                <Table.Body>
                    {mappedData}
                </Table.Body>
            )
        }
        else {
            if (_.isEmpty(data)) {

            }
            else {
                data = data[0]
                tableHeader = (
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={2} content='Property' />
                            <Table.HeaderCell width={5} content='Value' />
                        </Table.Row>
                    </Table.Header>
                )

                tableBody = (
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell content='Hostname' />
                            <Table.Cell >{data.Hostname}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell content='Alert Name' />
                            <Table.Cell >{data.AlertName}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell content='Alert Description' />
                            <Table.Cell >{data.AlertDescription}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell content='Note' />
                            <Table.Cell >{data.TicketId}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell content='Raised' />
                            <Table.Cell >{moment(data.RaisedDateTime).local().format("HH:mm:ss DD.MM.YYYY")}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                )
            }
        }

        return (
            <Table compact basic='very' size='small'>
                {tableHeader}
                {tableBody}
            </Table>
        )
    }
}