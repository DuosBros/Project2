import { combineReducers } from 'redux';

import HeaderReducer from '../reducers/HeaderReducer';
import BaseReducer from '../reducers/BaseReducer';

const CommonReducer = combineReducers({
    HeaderReducer, BaseReducer
});

export default CommonReducer;