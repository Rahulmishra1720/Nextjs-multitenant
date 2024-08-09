import { call, CallEffect, put, PutEffect } from 'redux-saga/effects';
import { fetchRolesAsync, getAccessToken } from '../services';
import { fetchRolesFailure, fetchRolesSuccess } from '../actions';

function* fetchRoleSaga(_action: any): Generator<CallEffect | PutEffect<{ type: string; payload?: any }>, void, any> {
	try {
		const token: string = yield call(getAccessToken);
		const data = yield call(fetchRolesAsync, token);
		yield put(fetchRolesSuccess(data));
	} catch (error: any) {
		yield put(fetchRolesFailure(error.message));
	}
}

export default fetchRoleSaga;
