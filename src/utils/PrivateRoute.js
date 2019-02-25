import React from 'react';
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ exact, isAdmin, component: Component, ...rest }) => (
    <Route exact={exact} {...rest} render={(props) => (
        isAdmin === true
            ? <Component {...props} />
            : <Redirect to='/' />
    )} />
)

export default PrivateRoute;