import React from 'react';
import { Input, Button } from 'semantic-ui-react';
import keyboardKey from 'keyboard-key'
import _ from 'lodash'

export default class SearchBox extends React.Component {
    state = {
        value: ""
    }

    handleChange = (e, { value }) => {
        this.setState({ value })
    }

    handleKeyPress = (e) => {
        const isEnter = keyboardKey.getKey(e) === 'Enter'

        if (isEnter) {
            this.handleWindowOpen()
        }
    }

    handleWindowOpen = () => {
        const encodedSearchExpression = encodeURIComponent(this.state.value.trim());
        const url = _.replace(this.props.url, new RegExp(this.props.pattern, "g"), encodedSearchExpression)
        const win = window.open(url, '_blank');
        try {
            win.opener = null;
        } catch(ex) {}
        win.focus();
    }

    render() {
        return (
            <React.Fragment>
                <Input onKeyPress={this.handleKeyPress} onChange={this.handleChange} placeholder={this.props.placeholder} />
                <Button onClick={() => this.handleWindowOpen()} circular icon="arrow right" id="homeSecondIcon" style={{ visibility: (this.state.value === "" ? "hidden" : "visible") }} />
            </React.Fragment>
        );
    }
}
