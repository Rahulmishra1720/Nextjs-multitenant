import { call, CallEffect, put, PutEffect, TakeEffect } from 'redux-saga/effects';
import { getUserInfoSuccess, getUserInfoFailure } from '../actions';
import { fetchRoleByUserIdAsync, fetchUserAsync, getAccessToken } from '../services';
import { IRole } from '../../interfaces';

function* userInfoSaga(
	action: any,
): Generator<CallEffect | PutEffect<{ type: string; payload?: any }> | TakeEffect, void, any> {
	try {
		const userId: string = action.payload;
		const token: string = yield call(getAccessToken);
		const data: IRole[] = yield call(fetchRoleByUserIdAsync, token, userId);
		const user = yield call(fetchUserAsync, token, userId);
		const isNewUser: boolean = user.logins_count === 1;
		yield put(getUserInfoSuccess(data, isNewUser));
	} catch (error: any) {
		yield put(getUserInfoFailure(error.message));
	}
}

export default userInfoSaga;
