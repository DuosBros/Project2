import React from 'react';
import { Ref } from 'semantic-ui-react'
import keyboardKey from 'keyboard-key'

export default class ShortcutFocus extends React.Component {

    componentDidMount() {
        document.addEventListener('keydown', this.handleDocumentKeyDown)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleDocumentKeyDown)
    }

    handleDocumentKeyDown = (e) => {
        const active = document.activeElement;
        const target = this.state.target;
        const shortcutMatch = keyboardKey.getKey(e) === this.props.shortcut;
        const hasModifier = e.altKey || e.ctrlKey || e.metaKey;

        if(!shortcutMatch || hasModifier) {
            return;
        }

        // don't steal focus from other elements that accept user input
        switch(active.tagName) {
            case "INPUT":
                if(active.type.toLowerCase() === 'text') {
                    return;
                }
                break;
            case "TEXTAREA":
                return;
            case "SELECT":
                return;
            default:
        }

        if(!target) {
            throw new Error("Can't set focus on target element. Element not found.");
        }
        target.focus();
        e.preventDefault();
    }

    handleRef = (c) => {
        let target = c && c.querySelector(this.props.focusSelector);
        this.setState({
            target
        });
    }

    render() {
        return (
            <Ref innerRef={this.handleRef}>
                {this.props.children}
            </Ref>
        )
    }
}
