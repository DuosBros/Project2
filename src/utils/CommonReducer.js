import { combineReducers } from 'redux';

import HeaderReducer from '../reducers/HeaderReducer';
import BaseReducer from '../reducers/BaseReducer';
import ServerReducer from '../reducers/ServerReducer';
import ServiceReducer from '../reducers/ServiceReducer';
import LoginReducer from '../reducers/LoginReducer';
import LoadBalancerFarmsReducer from '../reducers/LoadBalancerFarmsReducer';
import PatchGroupReducer from '../reducers/PatchGroupReducer';
import RolloutStatusReducer from '../reducers/RolloutStatusReducer';
import VirtualMachineReducer from '../reducers/VirtualMachineReducer';
import IPAddressReducer from '../reducers/IPAddressReducer';
import VersionStatusReducer from '../reducers/VersionStatusReducer';
import HealthReducer from '../reducers/HealthReducer';
import LoadBalancerReducer from '../reducers/LoadBalancerReducer';
import ActiveDirectoryReducer from '../reducers/ActiveDirectoryReducer';
import AgentLogReducer from '../reducers/AgentLogReducer';
import MiscReducer from '../reducers/MiscReducer';
import LTMGTMReducer from '../reducers/LTMGTMReducer';

const CommonReducer = combineReducers({
    HeaderReducer, BaseReducer, ServerReducer, ServiceReducer, LoginReducer, LoadBalancerFarmsReducer,
    PatchGroupReducer, RolloutStatusReducer, VirtualMachineReducer, IPAddressReducer, VersionStatusReducer,
    HealthReducer, LoadBalancerReducer, ActiveDirectoryReducer, AgentLogReducer, MiscReducer,
    LTMGTMReducer
});

export default CommonReducer;