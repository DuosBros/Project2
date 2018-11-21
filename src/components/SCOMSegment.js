import _ from 'lodash'
import React, { Component } from 'react'
import { Table, Button, Modal, Tab } from 'semantic-ui-react'
import moment from 'moment';

import { DISME_SERVICE_PLACEHOLDER, DISME_SERVICE_URL } from '../appConfig';
import { Link } from 'react-router-dom';

export default class SCOMSegment extends Component {

    state = {
        showScomModal: false
    }

    handleOpenScomAlerts = (data) => {
        console.log(data)
        this.setState({ showScomModal: !this.state.showScomModal });
    }


    render() {

        var data = this.props.data;
        var mappedData, tableHeader, tableBody, scomModal, href;
        console.log(data)

        if (this.state.showScomModal) {

            var panes = data.map((alert, index) => {
                return ({
                    menuItem: (index + 1) + ". SCOM Alert",
                    render: () =>
                        <Tab.Pane attached={false} key={index}>
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell width={2} content='Property' />
                                        <Table.HeaderCell width={5} content='Value' />
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell content='Alert Guid' />
                                        <Table.Cell >{alert.AlertGuid}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell content='Alert Description' />
                                        <Table.Cell >{alert.AlertDescription}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell content='Alert Object' />
                                        <Table.Cell >{alert.AlertObject}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell content='Category' />
                                        <Table.Cell >{alert.Category}</Table.Cell>
                                    </Table.Row>

                                    <Table.Row>
                                        <Table.Cell content='Disme IDs' />
                                        <Table.Cell >
                                            {
                                                alert.DismeIds.map(dismeId => {
                                                    return (
                                                        <Button
                                                            key={dismeId}
                                                            onClick={() =>
                                                                window.open(
                                                                    _.replace(DISME_SERVICE_URL, new RegExp(DISME_SERVICE_PLACEHOLDER, "g"),
                                                                        dismeId))}
                                                            style={{ padding: '0.3em' }}
                                                            size='medium'
                                                            icon='external' />
                                                    )
                                                })
                                            }
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell content='Display Name' />
                                        <Table.Cell >{alert.DisplayName}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell content='Environment' />
                                        <Table.Cell >{alert.Environment}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell content='Hostname' />
                                        <Table.Cell >{alert.Hostname}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell content='Raised DateTime' />
                                        <Table.Cell >{moment(alert.RaisedDateTime).local().format("HH:mm:ss DD.MM.YYYY")}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell content='Hostname' />
                                        <Table.Cell >{alert.Hostname}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell content='Services' />
                                        <Table.Cell >
                                            {
                                                alert.Services.map((service, index) => {
                                                    return (
                                                        <Link key={index} to={'/service/' + service.Id} target="_blank" />
                                                    )
                                                })
                                            }
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell content='StateSetDateTime' />
                                        <Table.Cell >{alert.StateSetDateTime}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell content='Note' />
                                        <Table.Cell >{alert.TicketId}</Table.Cell>
                                    </Table.Row>

                                </Table.Body>
                            </Table>
                        </Tab.Pane>
                })
            })

            scomModal = (
                <Modal
                    size='large'
                    open={this.state.showScomModal}
                    closeOnEscape={true}
                    closeOnDimmerClick={false}
                    closeIcon={true}
                    onClose={() => this.handleOpenScomAlerts()}
                >
                    <Modal.Header>Server SCOM Alerts</Modal.Header>
                    <Modal.Content>
                        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />

                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => this.handleOpenScomAlerts()} style=
                            {{ backgroundColor: '#9a3334', color: 'white' }} >
                            Close
                        </Button>
                    </Modal.Actions>
                </Modal>
            )
        }

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
                tableBody = (
                    <Table.Body>
                        <Table.Row colSpan={2}>
                            <Table.Cell>
                                No SCOM Alerts
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                )
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
                {scomModal}
                {tableHeader}
                {tableBody}
                {
                    _.isEmpty(data) ? (null) : (
                        <Table.Footer fullWidth>
                            <Table.Row>
                                <Table.HeaderCell colSpan='5'>
                                    <Button onClick={() => this.handleOpenScomAlerts(data)} floated="right">Show More</Button>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>)
                }

            </Table>
        )
    }
}