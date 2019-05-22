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
        modifiedLTMJSON: null,
        modifiedGTMJSON: null,
        isLtmJsonSegmentHidden: true,
        isGtmJsonSegmentHidden: true
    }

    componentDidMount() {
        document.title = APP_TITLE + "LTM GTM"
    }

    handleTeamDropdownChange = (e, { value }) => {
        this.props.getDefaultsAndHandleData(value);
    }

    fetchLTM = (payload) => {
        this.props.fetchLTM(payload)
        this.setState({ LTMPayload: payload });
    }

    fetchGTM = (payload) => {
        this.props.fetchGTM(payload)
    }

    handleEditLTMJSON = (e, m) => {
        this.setState({ modifiedLTMJSON: e.updated_src });
    }

    handleEditGTMJSON = (e, m) => {
        this.setState({ modifiedGTMJSON: e.updated_src });
    }

    handleToggleShowingContent = (segment) => {
        this.setState({ [segment]: !this.state[segment] });
    }

    render() {
        let LTMJson, GTMSegment, GTMJson;

        if (!this.props.ltmJson.success) {
            LTMJson = (
                <ErrorMessage error={this.props.ltmJson.error} />
            );
        }
        else {
            let json = JSON.stringify(this.state.modifiedLTMJSON ? this.state.modifiedLTMJSON : this.props.ltmJson.data, null, 4);

            if (!this.state.isLtmJsonSegmentHidden) {
                LTMJson = (
                    <Header block attached='top' as='h4'>
                        <Button id="skip" color="black" onClick={() => this.props.saveJson({ type: "LTM", data: json, payload: this.state.LTMPayload })}>
                            Download
                        </Button>
                        <Button onClick={() => this.handleToggleShowingContent("isLtmJsonSegmentHidden")} floated='right' icon='content' />
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
                            <Button id="skip" color="black" onClick={() => this.props.saveJson({ type: "LTM", data: json, payload: this.state.LTMPayload })}>
                                Download
                            </Button>
                            <Button onClick={() => this.handleToggleShowingContent("isLtmJsonSegmentHidden")} floated='right' icon='content' />
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
                            onDelete={this.handleEditLTMJSON}
                            onAdd={this.handleEditLTMJSON}
                            onEdit={this.handleEditLTMJSON}
                            iconStyle="square"
                        />
                    </>
                )

            }
        }

        if (!this.props.gtmJson.success) {
            GTMJson = (
                <ErrorMessage error={this.props.gtmJson.error} />
            );
        }
        else {
            let json = JSON.stringify(this.state.modifiedGTMJSON ? this.state.modifiedGTMJSON : this.props.gtmJson.data, null, 4);

            if (!this.state.isGtmJsonSegmentHidden) {
                GTMJson = (
                    <Header block attached='top' as='h4'>
                        <Button id="skip" color="black" onClick={() => this.props.saveJson({ type: "GTM", data: json, payload: this.state.LTMPayload })}>
                            Download
                        </Button>
                        <Button onClick={() => this.handleToggleShowingContent("isGtmJsonSegmentHidden")} floated='right' icon='content' />
                    </Header>
                )
            }
            else if (this.props.gtmJson.isFetching) {
                GTMJson = (
                    <div className="messageBox">
                        <Message info icon>
                            <Icon name='circle notched' loading />
                            <Message.Content>
                                <Message.Header>Fetching GTM JSON</Message.Header>
                            </Message.Content>
                        </Message>
                    </div>
                );
            }
            else if (this.props.gtmJson.data) {
                GTMJson = (
                    <>
                        <Header block attached='top' as='h4'>
                            <Button id="skip" color="black" onClick={() => this.props.saveJson({ type: "GTM", data: json, payload: this.state.LTMPayload })}>
                                Download
                            </Button>
                            <Button onClick={() => this.handleToggleShowingContent("isGtmJsonSegmentHidden")} floated='right' icon='content' />
                        </Header>
                        <ReactJson
                            style={{ padding: '1em' }}
                            name={false}
                            theme="solarized"
                            collapseStringsAfterLength={false}
                            src={this.props.gtmJson.data}
                            collapsed={false}
                            indentWidth={4}
                            displayObjectSize={false}
                            displayDataTypes={false}
                            enableClipboard={true}
                            onDelete={this.handleEditGTMJSON}
                            onAdd={this.handleEditGTMJSON}
                            onEdit={this.handleEditGTMJSON}
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
                                fetchGTM={this.fetchGTM}
                                ltmJson={this.props.ltmJson.data}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {GTMJson}
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
                            LTM & GTM Setup - check the output of jsons!
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
                                            fetchGTM={this.fetchGTM}
                                            defaults={this.props.defaults}
                                            team={this.props.team}
                                            ltmJson={this.state.modifiedLTMJSON ? this.state.modifiedLTMJSON : this.props.ltmJson.data}
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={GTMJson ? 2 : 1}>
                                    <Grid.Column>
                                        {LTMJson}
                                    </Grid.Column>
                                    {
                                        GTMJson && (
                                            <Grid.Column>
                                                {GTMJson}
                                            </Grid.Column>
                                        )
                                    }
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