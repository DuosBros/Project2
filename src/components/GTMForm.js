import React, { Component } from "react";
import { Button, Grid, Popup } from "semantic-ui-react";

class GTMForm extends Component {
    state = {}
    render() {
        let generateGTMFromLTMButton;
        if (this.props.ltmJson) {
            generateGTMFromLTMButton = <Button content="Generate GTM from LTM" onClick={() => this.props.fetchGTM({ ltm: this.props.ltmJson }, true)} />
        }
        else {
            generateGTMFromLTMButton = (<Popup position="right center" trigger={
                <span>
                    <Button content="Generate GTM from LTM" disabled />
                </span>
            } inverted content="Generate LTM JSON first" />)
        }

        return (
            <Grid>
                <Grid.Row columns={4}>
                    <Grid.Column width={4}>
                        {generateGTMFromLTMButton}
                    </Grid.Column>
                    <Grid.Column width={4}>
                    </Grid.Column>
                    <Grid.Column width={4}></Grid.Column>
                    <Grid.Column width={4}></Grid.Column>
                </Grid.Row>
            </Grid >
        );
    }
}

export default GTMForm;