import { takeLatest } from 'redux-saga/effects';
import { FETCH_ROLES, FETCH_USER_INFORMATION } from '../actions';
import userInfoSaga from './userInfoSaga';
import fetchRoleSaga from './fetchRoleSaga';

export function* userInfoRootSaga() {
	yield takeLatest(FETCH_USER_INFORMATION, userInfoSaga);
	yield takeLatest(FETCH_ROLES, fetchRoleSaga);
}
