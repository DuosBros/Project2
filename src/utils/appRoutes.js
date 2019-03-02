import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import axios from 'axios';

import CommonReducer from './CommonReducer';

import Base from './Base';

export default class AppRoutes extends React.Component {
    constructor() {
        super();
        this.store = createStore(CommonReducer);

        axios.defaults.headers.post['Content-Type'] = 'application/json';
    }

    render() {
        return (
            <Provider store={this.store}>
                <Base />
            </Provider>
        );
    }
}
