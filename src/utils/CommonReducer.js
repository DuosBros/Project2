import { combineReducers } from 'redux';

import HeaderReducer from '../reducers/HeaderReducer';
import BaseReducer from '../reducers/BaseReducer';
import ServerReducer from '../reducers/ServerReducer';
import ServiceReducer from '../reducers/ServiceReducer';
import LoginReducer from '../reducers/LoginReducer';
import LoadBalancerFarmsTasksReducer from '../reducers/LoadBalancerFarmsTasksReducer';
import PatchGroupReducer from '../reducers/PatchGroupReducer';
import RolloutStatusReducer from '../reducers/RolloutStatusReducer';
import VirtualMachineReducer from '../reducers/VirtualMachineReducer';

const CommonReducer = combineReducers({
    HeaderReducer, BaseReducer, ServerReducer, ServiceReducer, LoginReducer, LoadBalancerFarmsTasksReducer,
    PatchGroupReducer, RolloutStatusReducer, VirtualMachineReducer
});

export default CommonReducer;