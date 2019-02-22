import React from 'react';
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({exact: exact, isAdmin: isAdmin, component: Component, ...rest }) => (
    <Route exact={exact} {...rest} render={(props) => (
        isAdmin === true
            ? <Component {...props} />
            : <Redirect to='/home' />
    )} />
)

export default PrivateRoute;