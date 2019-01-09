import React from 'react'
import { Message, Icon, Image } from 'semantic-ui-react'
import pikachu from '../assets/pikachu.jpg'

class ErrorMessage extends React.Component {
    state = {
        isRefreshButtonLoading: false
    }

    handleRefresh = () => {
        this.setState({ isRefreshButtonLoading: true });
        this.props.handleRefresh();
        this.setState({ isRefreshButtonLoading: false });
    }

    render() {
        return (
            <Message icon>
                <Image src={pikachu} size='tiny' spaced />
                <Message.Content>
                    <Message.Header>{(this.props.title || "Ooops something went wrong")}</Message.Header>
                    {this.props.message || "Failed to load data."}
                    <br />
                    {
                        this.props.handleRefresh ?
                            (
                                <>
                                    Try again
                                    <Icon
                                        className="pointerCursor"
                                        onClick={() => this.handleRefresh()}
                                        name="refresh"
                                        loading={this.state.isRefreshButtonLoading} />
                                </>
                            ) : (
                                null
                            )
                    }

                </Message.Content>
            </Message>
        )
    }
}


export default ErrorMessage;