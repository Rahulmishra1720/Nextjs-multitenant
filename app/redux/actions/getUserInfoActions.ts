import { IRole } from '../../interfaces';

export const FETCH_USER_INFORMATION: string = 'FETCH_USER_INFORMATION';
export const FETCH_USER_INFORMATION_SUCCESS: string = 'FETCH_USER_INFORMATION_SUCCESS';
export const FETCH_USER_INFORMATION_FAILURE: string = 'FETCH_USER_INFORMATION_FAILURE';

export const getUserInfo = (userId: string) => {
	return {
		type: FETCH_USER_INFORMATION,
		payload: userId,
	};
};

export const getUserInfoSuccess = (roles: IRole[], isNewUser: boolean) => {
	return {
		type: FETCH_USER_INFORMATION_SUCCESS,
		payload: { roles, isNewUser },
	};
};

export const getUserInfoFailure = (failureMessage: string) => {
	return {
		type: FETCH_USER_INFORMATION_FAILURE,
		payload: failureMessage,
	};
};
