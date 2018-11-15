import _ from 'lodash'
import React, { Component } from 'react'
import { Table, Button, Modal, Tab } from 'semantic-ui-react'
import moment from 'moment';

import { DISME_SERVICE_PLACEHOLDER, DISME_SERVICE_URL } from '../appConfig';

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
        var mappedData, tableHeader, tableBody, scomModal;
        console.log(data)

        if (this.state.showScomModal) {

            var counter = 0;
            var panes = data.map(alert => {
                counter++
                return ({
                    menuItem: counter + ". SCOM Alert",
                    render: () => <Tab.Pane attached={false} key={counter}>
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
                                    <Table.Cell >{data.AlertGuid}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell content='Alert Description' />
                                    <Table.Cell >{data.AlertDescription}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell content='Alert Object' />
                                    <Table.Cell >{data.AlertObject}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell content='Category' />
                                    <Table.Cell >{data.Category}</Table.Cell>
                                </Table.Row>

                                <Table.Row>
                                    <Table.Cell content='Disme IDs' />
                                    <Table.Cell >
                                        {
                                            data.DismeIds.map(dismeId => {
                                                return (
                                                    <Button
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
                                    <Table.Cell >{data.DisplayName}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell content='Environment' />
                                    <Table.Cell >{data.Environment}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell content='Hostname' />
                                    <Table.Cell >{data.Hostname}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell content='Raised DateTime' />
                                    <Table.Cell >{moment(data.RaisedDateTime).local().format("HH:mm:ss DD.MM.YYYY")}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell content='Hostname' />
                                    <Table.Cell >{data.Hostname}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell content='Services' />
                                    <Table.Cell >
                                        {
                                            data.Services.map(service => {
                                                return (
                                                    // href={_.replace(KIBANA_WINLOGBEAT_SERVER_URL, new RegExp(KIBANA_SERVER_URL_PLACEHOLDER, "g"), serverDetails.ServerName)}
                                                    <a target="_blank" rel="noopener noreferrer" href="http://pica.com" >{service}</a>
                                                )
                                            })
                                        }
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell content='StateSetDateTime' />
                                    <Table.Cell >{data.StateSetDateTime}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell content='Note' />
                                    <Table.Cell >{data.TicketId}</Table.Cell>
                                </Table.Row>
                                
                            </Table.Body>
                        </Table>
                    </Tab.Pane>
                }
                )
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
                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell colSpan='5'>
                            <Button onClick={() => this.handleOpenScomAlerts(data)} floated="right">Show More</Button>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        )
    }
}