// sagas/index.js
import { all } from 'redux-saga/effects';
import { userInfoRootSaga } from '../redux/sagas';

function* rootSaga() {
	yield all([userInfoRootSaga()]);
}

export default rootSaga;
