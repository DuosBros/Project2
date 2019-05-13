import React from 'react';
import { Grid, Header, Segment, Dropdown, TextArea, Message, Icon, Form, Button } from 'semantic-ui-react';
import { DEFAULT_TEAMS, APP_TITLE } from '../appConfig';
import LTMForm from '../components/LTMForm';
import ErrorMessage from '../components/ErrorMessage';
import ReactJson from 'react-json-view'

class LTM extends React.PureComponent {

    state = {
        team: "B2C",
        LTMPayload: "",
        modifiedJSON: null
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

    render() {
        let LTMJson;

        if (this.state.LTMPayload) {
            if (!this.props.ltmJson.success) {
                LTMJson = (
                    <ErrorMessage error={this.props.ltmJson.error} />
                );
            }
            else if (!this.props.ltmJson.data) {
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
            else {
                let json = JSON.stringify(this.state.modifiedJSON ? this.state.modifiedJSON : this.props.ltmJson.data, null, 4);
                LTMJson = (
                    <>

                        <Header block attached='top' as='h4'>
                            <Button color="black" onClick={() => this.props.saveLTMJson({ data: json, payload: this.state.LTMPayload })}>
                                Download
                            </Button>
                            {/* <Button color="black" onClick={this.copyToClipboard}>
                                Copy to clipboard
                            </Button> */}
                        </Header>
                        <ReactJson
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


        return (
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Header block attached='top' as='h4'>
                            LTM Setup
                        </Header>
                        <Segment attached='bottom' >
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={4}>
                                        <strong>Team:</strong>
                                        <Dropdown fluid text={this.state.team} defaultValue={this.state.team} onChange={this.handleTeamDropdownChange} options={DEFAULT_TEAMS} selection />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <LTMForm
                                            team={this.state.team}
                                            handleServiceChange={this.props.handleServiceChange}
                                            searchServiceShortcutsResult={this.props.searchServiceShortcutsResult}
                                            handleServiceShortcutSearchChange={this.props.handleServiceShortcutSearchChange}
                                            selectedService={this.props.selectedService}
                                            labels={this.props.labels}
                                            fetchLTM={this.fetchLTM}
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

export default LTM;