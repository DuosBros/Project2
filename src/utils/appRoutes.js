import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import axios from 'axios';

import CommonReducer from './CommonReducer';

import Header from './Header';
import Home from '../pages/Home/Home';

export default class AppRoutes extends React.Component {
    constructor() {
        super();
        this.store = createStore(CommonReducer);

        axios.defaults.headers.post['Content-Type'] = 'application/json';
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
                <div>
                    <Header />
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        {/* both /roster and /roster/:number begin with /roster */}
                        {/* <Route path='/roster' component={Roster}/>
                        <Route path='/schedule' component={Schedule}/> */}
                    </Switch>
                </div>
            </Provider>
        );
    }
}