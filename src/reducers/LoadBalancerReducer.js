import { GET_LOADBALANCERS, GET_LOADBALANCERS_TOKENS, DELETE_LOADBALANCER_TOKEN } from '../constants/LoadBalancerConstants';

const initialState = {
    loadBalancers: { success: true }
}

const LoadBalancerReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_LOADBALANCERS:
            return Object.assign({}, state, { loadBalancers: action.payload })
        case GET_LOADBALANCERS_TOKENS:
            var temp = Object.assign({}, state.loadBalancers)
            if (temp.success && temp.data && action.payload.data) {
                action.payload.data.forEach(element => {
                    var index = temp.data.findIndex(x => x.Id === element.LbId)

                    if (index > 0) {
                        temp.data[index].token = element.Token
                        temp.data[index].expiration = element.expiration
                    }
                });
            }
            
            return Object.assign({}, state, { loadBalancers: temp })
        case DELETE_LOADBALANCER_TOKEN:
            var temp = Object.assign({}, state.loadBalancers)
            if (action.payload.success) {

                var index = temp.data.findIndex(x => x.Id === action.payload.data)

                if (index > 0) {
                    delete temp.data[index].token
                    delete temp.data[index].expiration
                }
            }
            return Object.assign({}, state, { loadBalancers: temp })
        default:
            return state;
    }
}

export default LoadBalancerReducer;
