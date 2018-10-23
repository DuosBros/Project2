import { combineReducers } from 'redux';

import HeaderReducer from '../reducers/HeaderReducer';
import BaseReducer from '../reducers/BaseReducer';
import ServerReducer from '../reducers/ServerReducer';
import ServiceReducer from '../reducers/ServiceReducer';

const CommonReducer = combineReducers({
    HeaderReducer, BaseReducer, ServerReducer, ServiceReducer
});

export default CommonReducer;