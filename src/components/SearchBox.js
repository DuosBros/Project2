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
            var url = _.replace(this.props.url, new RegExp(this.props.pattern, "g"), this.state.value)
            var win = window.open(url, '_blank');
            win.focus();

        }
    }

    render() {
        return (
            <React.Fragment>
                <Input onKeyPress={this.handleKeyPress} onChange={this.handleChange} placeholder={this.props.placeholder}/>
                <Button circular icon="arrow right" id="homeSecondIcon" style={{ visibility: (this.state.value === "" ? "hidden" : "visible") }}/>
            </React.Fragment>
        );
    }
}
