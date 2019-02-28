import React from 'react';
import ErrorMessage from "./ErrorMessage";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorInfo: null
        };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        var {
            error,
            errorInfo
        } = this.state;

        if(errorInfo) {
            return (
                <ErrorMessage handleRefresh={() => window.location.reload()}  error={error} errorInfo={errorInfo} />
            );
        }

        return this.props.children;
    }
}
