import React from 'react';
import ErrorMessage from "./ErrorMessage";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error: error };
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <ErrorMessage error={this.state.error} />
        }

        return this.props.children;
    }
}