import React from 'react';
import { Grid, Header, Segment, Dropdown, Message, Icon, Button } from 'semantic-ui-react';
import { DEFAULT_TEAMS, APP_TITLE } from '../appConfig';
import LTMForm from '../components/LTMForm';
import ErrorMessage from '../components/ErrorMessage';
import ReactJson from 'react-json-view'
import GTMForm from '../components/GTMForm';

class LTMGTM extends React.PureComponent {

    state = {
        LTMPayload: "",
        modifiedJSON: null,
        ltmJsonSegment: true
    }

    componentDidMount() {
        document.title = APP_TITLE + "LTM JSON [" + this.state.team + "]"
    }

    handleTeamDropdownChange = (e, { value }) => {
        this.props.getDefaultsAndHandleData(value);
    }

    fetchLTM = (payload) => {
        this.props.fetchLTM(payload)
        this.setState({ LTMPayload: payload });
    }

    handleEdit = (e, m) => {
        this.setState({ modifiedJSON: e.updated_src });
    }

    handleToggleShowingContent = (segment) => {
        this.setState({ [segment]: !this.state[segment] });
    }

    render() {
        let LTMJson, GTMSegment;

        if (!this.props.ltmJson.success) {
            LTMJson = (
                <ErrorMessage error={this.props.ltmJson.error} />
            );
        }
        else {
            let json = JSON.stringify(this.state.modifiedJSON ? this.state.modifiedJSON : this.props.ltmJson.data, null, 4);

            if (!this.state.ltmJsonSegment) {
                LTMJson = (
                    <Header block attached='top' as='h4'>
                        <Button id="skip" color="black" onClick={() => this.props.saveLTMJson({ data: json, payload: this.state.LTMPayload })}>
                            Download
                        </Button>
                        <Button onClick={() => this.handleToggleShowingContent("ltmJsonSegment")} floated='right' icon='content' />
                    </Header>
                )
            }
            else if (this.props.ltmJson.isFetching) {
                LTMJson = (
                    <div className="messageBox">
                        <Message info icon>
                            <Icon name='circle notched' loading />
                            <Message.Content>
                                <Message.Header>Fetching LTM JSON</Message.Header>
                            </Message.Content>
                        </Message>
                    </div>
                );
            }
            else if (this.props.ltmJson.data) {
                LTMJson = (
                    <>
                        <Header block attached='top' as='h4'>
                            <Button id="skip" color="black" onClick={() => this.props.saveLTMJson({ data: json, payload: this.state.LTMPayload })}>
                                Download
                            </Button>
                            <Button onClick={() => this.handleToggleShowingContent("ltmJsonSegment")} floated='right' icon='content' />
                        </Header>
                        <ReactJson
                            style={{ padding: '1em' }}
                            name={false}
                            theme="solarized"
                            collapseStringsAfterLength={false}
                            src={this.props.ltmJson.data}
                            collapsed={false}
                            indentWidth={4}
                            displayObjectSize={false}
                            displayDataTypes={false}
                            enableClipboard={true}
                            onDelete={this.handleEdit}
                            onAdd={this.handleEdit}
                            onEdit={this.handleEdit}
                            iconStyle="square"
                        />
                    </>
                )

            }
        }

        GTMSegment = (
            <Segment attached='bottom' >
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <GTMForm
                                team={this.props.team}
                                handleServiceChange={this.props.handleServiceChange}
                                searchServiceShortcutsResult={this.props.searchServiceShortcutsResult}
                                handleServiceShortcutSearchChange={this.props.handleServiceShortcutSearchChange}
                                selectedService={this.props.selectedService}
                                labels={this.props.labels}
                                fetchLTM={this.fetchLTM}
                                defaults={this.props.defaults}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )

        return (
            <Grid stackable>
                {/* <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            [Beta] GTM Setup - check the output of json
                        </Header>
                        {GTMSegment}
                    </Grid.Column>
                </Grid.Row> */}
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            [Beta] LTM Setup - check the output of json!
                        </Header>
                        <Segment attached='bottom' >
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={4}>
                                        <strong>Team:</strong>
                                        <Dropdown fluid defaultValue={this.state.team} onChange={this.handleTeamDropdownChange} options={DEFAULT_TEAMS} selection />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <LTMForm
                                            handleServiceChange={this.props.handleServiceChange}
                                            searchServiceShortcutsResult={this.props.searchServiceShortcutsResult}
                                            handleServiceShortcutSearchChange={this.props.handleServiceShortcutSearchChange}
                                            selectedService={this.props.selectedService}
                                            labels={this.props.labels}
                                            fetchLTM={this.fetchLTM}
                                            defaults={this.props.defaults}
                                            team={this.props.team}
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        {LTMJson}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default LTMGTM;