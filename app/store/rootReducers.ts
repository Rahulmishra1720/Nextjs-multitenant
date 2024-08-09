// reducers/index.js
import { combineReducers } from 'redux';
import userInfoRootReducer from '../redux/reducers/userInfoRootReducer';

const rootReducer = combineReducers({
	user: userInfoRootReducer,
});

export default rootReducer;
