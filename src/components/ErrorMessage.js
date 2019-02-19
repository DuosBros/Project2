import React, { useState } from 'react'
import { Message, Icon, Image } from 'semantic-ui-react'
import pikachu from '../assets/pikachu.jpg'

const ErrorMessage = (props) => {
    const [isRefreshButtonLoading, toggleRefreshButtonLoading] = useState(0);

    const handleRefresh = () => {
        toggleRefreshButtonLoading(true);
        props.handleRefresh();
        toggleRefreshButtonLoading(false);
    }

    let refresh = null;
    if (props.handleRefresh) {
        refresh = (
            <>
                Try again
                <Icon
                    className="pointerCursor"
                    onClick={() => handleRefresh()}
                    name="refresh"
                    loading={isRefreshButtonLoading} />
            </>
        )
    }
    
    return (
        <Message icon>
            <Image src={pikachu} size='tiny' spaced />
            <Message.Content>
                <Message.Header>{(props.title || "Ooops something went wrong")}</Message.Header>
                {props.message === "" ? null : <>{props.message} <br /></>}
                {refresh}
            </Message.Content>
        </Message>
    )
}

export default ErrorMessage;