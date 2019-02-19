import React, { useState } from 'react'
import { Message, Icon, Image } from 'semantic-ui-react'
import pikachu from '../assets/pikachu.jpg'

const ErrorMessage = (props) => {
    const [isRefreshButtonLoading, toggleRefreshButtonLoading] = useState(0);

    handleRefresh = () => {
        toggleRefreshButtonLoading(true);
        props.handleRefresh();
        toggleRefreshButtonLoading(false);
    }

    return (
        <Message icon>
            <Image src={pikachu} size='tiny' spaced />
            <Message.Content>
                <Message.Header>{(props.title || "Ooops something went wrong")}</Message.Header>
                {props.message === "" ? null : <>{props.message} <br /></>}

                {
                    props.handleRefresh ?
                        (
                            <>
                                Try again
                                    <Icon
                                    className="pointerCursor"
                                    onClick={() => this.handleRefresh()}
                                    name="refresh"
                                    loading={isRefreshButtonLoading} />
                            </>
                        ) : (
                            null
                        )
                }

            </Message.Content>
        </Message>
    )
}

export default ErrorMessage;