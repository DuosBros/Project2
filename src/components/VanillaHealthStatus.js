import React, { Component } from 'react';
import { Label, Popup } from 'semantic-ui-react';

export default class VanillaHealthStatus extends Component {

    render() {
        var state = this.props.status;
        var color;

        if (state[0] === "warning") {
            color = 'orange'
        }
        else if (state[0] === "success") {
            color = 'green'
        }
        else {
            color = 'red'
        }

        return (
            <>
                {
                    state[1].toLowerCase() === "vanilla" ? (
                        <Popup trigger={
                            <Label style={{ cursor: 'pointer' }} size={this.props.size} color={color} horizontal onClick={() =>
                                window.open(this.props.url)}>
                                {state[1] ? state[1] : "no data - refresh"}

                            </Label>
                        } content='Go to Vanilla healthcheck' inverted />
                    ) : (
                            <Label size={this.props.size} color={color} horizontal>
                                {state[1] ? state[1] : "no data - refresh"}

                            </Label>
                        )
                }

                {/* <Button
                    onClick={() =>
                        window.open(this.props.url)}
                    style={{ padding: '0.3em' }}
                    size='medium'
                    icon='external' /> */}
            </>
        )
    }
}

