import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';
import axios from 'axios';

import Header from './Header';
import Footer from './Footer';
import Home from '../pages/Home';
import ServerDetails from '../pages/ServerDetails';

import { authenticateAction } from '../actions/BaseAction';
import { authenticate } from '../requests/BaseAxios';

class Base extends React.Component {
    constructor(props) {
        super(props)
        authenticate()
            .then(res => {
                this.props.authenticateAction(res.data)
            })
    }
    render() {
        return (
            <div >
                <Header />
                <div id="contentwrapper">
                    <BrowserRouter>
                        <Switch>
                            <Route exact path='/' component={Home} />
                            <Route path='/server/details/:id' render={props => <ServerDetails {...props} />} />
                            {/* both /roster and /roster/:number begin with /roster */}
                            {/* <Route path='/roster' component={Roster}/>
                            <Route path='/schedule' component={Schedule}/> */}
                        </Switch>
                    </BrowserRouter>
                </div>
                <Footer id="footer" />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        baseStore: state.BaseReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        authenticateAction: authenticateAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Base);