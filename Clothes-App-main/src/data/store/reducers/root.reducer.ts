import { combineReducers } from 'redux';
import CounterReducer from './counter/counter.reducer';
import { UserReducer } from './user/user.reducer';
import { CartReducer } from './cart/cart.reducer';
import { NotificationReducer } from './notification/notification.reducer';

const rootReducer = combineReducers({
    counter: CounterReducer,
    userLogged: UserReducer,
    cart: CartReducer,
    notification: NotificationReducer
})

export default rootReducer;