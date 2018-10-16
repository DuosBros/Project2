import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import axios from 'axios';

import CommonReducer from './CommonReducer';

import Header from './Header';
import Footer from './Footer';
import Home from '../pages/Home';

export default class AppRoutes extends React.Component {
    constructor() {
        super();
        this.store = createStore(CommonReducer);

        axios.defaults.headers.post['Content-Type'] = 'application/json';
        fetch("https://loco.bwin.prod/", {
            mode: "cors",
            credentials: "include"
        })
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
                <div >
                    <Header />
                    <div id="contentwrapper">
                        <Switch>
                            <Route path='/' component={Home}/>
                            {/* both /roster and /roster/:number begin with /roster */}
                            {/* <Route path='/roster' component={Roster}/>
                            <Route path='/schedule' component={Schedule}/> */}
                        </Switch>
                    </div>
                    <Footer id="footer"/>
                </div>
            </Provider>
        );
    }
}
