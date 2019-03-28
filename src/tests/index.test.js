import React from 'react';
import ReactDOM from 'react-dom';
import AppRoutes from '../utils/appRoutes';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<AppRoutes />, div);
});