import React, { Component } from 'react'
import { Message, Icon, Image, Accordion } from 'semantic-ui-react'
import { NODE_ENV } from '../appConfig'
import pikachu from '../assets/pikachu.jpg'

export default class ErrorMessage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAccordionExpanded: false
        }
    }

    componentDidMount() {
        const { error, errorInfo } = this.props;
        if (error || errorInfo) {
            console.log("An error occurred. Here are some details:", { error, errorInfo });
        }
    }

    handleRefresh = () => {
        this.props.handleRefresh();
    }

    handleToggleAccordion = () => {
        this.setState(prev => {
            return { isAccordionExpanded: !prev.isAccordionExpanded };
        });
    }

    renderErrorAccordeon(error, errorInfo) {
        const { isAccordionExpanded } = this.state;
        let errorDetails = [];
        if (error) {
            if (error.hasOwnProperty("name")) {
                errorDetails.push((
                    <div key="name">
                        <strong>{error.name}</strong>
                    </div>
                ));
            }
            if (error.hasOwnProperty("message")) {
                errorDetails.push((
                    <div key="message">
                        <pre style={{ whiteSpace: "pre-wrap" }}>{error.message.split('\n')[0]}</pre>
                    </div>
                ));
            }
        }

        if (errorInfo && errorInfo.hasOwnProperty("componentStack")) {
            errorDetails.push((
                <div key="stack" style={{ overflow: "auto" }}>
                    <pre>{errorInfo.componentStack}</pre>
                </div>
            ));
        }

        if (errorDetails.length < 1) {
            return null;
        }

        return (
            <Accordion>
                <Accordion.Title active={isAccordionExpanded} index={0} onClick={this.handleToggleAccordion}>
                    <Icon name='dropdown' />
                    Details
                </Accordion.Title>
                <Accordion.Content active={isAccordionExpanded}>
                    {errorDetails}
                </Accordion.Content>
            </Accordion>
        );
    }

    render() {
        const {
            title,
            message,
            error,
            errorInfo,
            handleRefresh
        } = this.props;

        let refresh = null;
        if (handleRefresh) {
            refresh = (
                <div>
                    Try again
                    <Icon
                        className="pointerCursor"
                        onClick={this.handleRefresh}
                        name="refresh" />
                </div>
            )
        }

        let errorAccordion = NODE_ENV === 'development' ? this.renderErrorAccordeon(error, errorInfo) : null;

        return (
            <Message icon>
                <Image src={pikachu} size='tiny' spaced />
                <Message.Content>
                    <Message.Header>{(title || "Ooops something went wrong")}</Message.Header>
                    {message === "" ? null : <>{message} <br /></>}
                    {refresh}
                    {errorAccordion}
                </Message.Content>
            </Message>
        );
    }
}
