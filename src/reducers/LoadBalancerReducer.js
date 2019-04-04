import { GET_LOADBALANCERS, GET_LOADBALANCERS_TOKENS, DELETE_LOADBALANCER_TOKEN } from '../utils/constants';

const initialState = {
    loadBalancers: { success: true }
}

const LoadBalancerReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_LOADBALANCERS:
            // sort the data for distinct values for GT
            if (action.payload.success && action.payload.data) {
                action.payload.data = action.payload.data.sort((a, b) => (a.Name > b.Name) ? 1 : -1)
            }
            return Object.assign({}, state, { loadBalancers: action.payload })
        case GET_LOADBALANCERS_TOKENS:
            let temp = Object.assign({}, state.loadBalancers)
            temp.data = temp.data.slice();
            if (temp.success && temp.data && action.payload.data) {
                action.payload.data.forEach(element => {
                    var index = temp.data.findIndex(x => x.Id === element.LbId)

                    if (index >= 0) {
                        temp.data[index].token = element.Token
                        temp.data[index].expiration = element.expiration
                    }
                });
            }

            return Object.assign({}, state, { loadBalancers: temp })
        case DELETE_LOADBALANCER_TOKEN:
            temp = Object.assign({}, state.loadBalancers)
            temp.data = temp.data.slice();
            if (action.payload.success) {

                var index = temp.data.findIndex(x => x.Id === action.payload.data)

                if (index >= 0) {
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
