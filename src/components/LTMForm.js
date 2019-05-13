import React from 'react';
import { Form, Grid, Dropdown, Button } from 'semantic-ui-react';
import { DEFAULT_TEAMS, LTMB2CTYPES } from '../appConfig';
import ServiceSearchDropdown from './ServiceSearchDropdown';
import { mapArrayForDropdown } from '../utils/HelperFunction';

class LTMForm extends React.PureComponent {
    state = {}

    handleTypeOnchange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    render() {
        let form, typeRow, generateLTMJsonColumn;

        if (this.state.type) {
            generateLTMJsonColumn = (
                <Grid.Column width={4} >
                    <Button onClick={() => this.props.fetchLTM({ Type: this.state.type, Service: this.props.selectedService })} content="GO" />
                    {/* <Dropdown name="label" options={mapArrayForDropdown(this.props.labels)} search onChange={this.handleTypeOnchange} fluid selection /> */}
                </Grid.Column>
            )
        }
        if (this.props.selectedService) {
            typeRow = (
                <Grid.Row columns={4} verticalAlign="bottom">
                    <Grid.Column width={4}>
                        <strong>Type:</strong>
                        <Dropdown name="type" onChange={this.handleTypeOnchange} fluid selection options={LTMB2CTYPES} />
                    </Grid.Column>
                    {generateLTMJsonColumn}
                </Grid.Row>
            )
        }

        if (this.props.team === DEFAULT_TEAMS[0].value) {
            form = (
                <Grid>
                    <Grid.Row columns={4}>
                        <Grid.Column width={4}>
                            <strong>Service:</strong>
                            <Form.Input value={this.props.selectedService} fluid disabled></Form.Input>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <strong>Search service:</strong>
                            <ServiceSearchDropdown
                                className="search"
                                handleServiceChange={this.props.handleServiceChange}
                                options={this.props.searchServiceShortcutsResult}
                                handleServiceShortcutSearchChange={this.props.handleServiceShortcutSearchChange} />
                        </Grid.Column>
                        <Grid.Column width={4}></Grid.Column>
                        <Grid.Column width={4}></Grid.Column>
                    </Grid.Row>
                    {typeRow}
                </Grid>


            )
        }
        return (
            <>
                {form}
            </>
        );
    }
}

export default LTMForm;