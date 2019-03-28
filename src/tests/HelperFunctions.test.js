import React from 'react';
import ReactDOM from 'react-dom';
import { isNum } from '../utils/HelperFunction';

it('isNum', () => {
    expect(isNum("5")).toEqual(true)
});