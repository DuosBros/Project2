import { combineReducers } from 'redux';

import HeaderReducer from '../reducers/HeaderReducer';
import BaseReducer from '../reducers/BaseReducer';
import ServerReducer from '../reducers/ServerReducer';

const CommonReducer = combineReducers({
    HeaderReducer, BaseReducer, ServerReducer
});

export default CommonReducer;