import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import axios from 'axios';

import CommonReducer from './CommonReducer';

import Header from './Header';
import Footer from './Footer';
import Home from '../pages/Home';
import Base from './Base';

export default class AppRoutes extends React.Component {
    constructor() {
        super();
        this.store = createStore(CommonReducer);

        axios.defaults.headers.post['Content-Type'] = 'application/json';
        // axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        // fetch("http://localhost:24298/api/auth/", {
        //     mode: "cors",
        //     credentials: "include"
        // })
    }

    componentWillMount() {
        // var current = window.location.href

        // if(current.includes('patients') || current.includes('graphs')) {

        // }
        // else {
        //     browserHistory.push('/login')
        // }

    }

    render() {
        return (
            <Provider store={this.store}>
                <Base />
            </Provider>
        );
    }
}
