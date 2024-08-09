export const FETCH_ROLES: string = 'FETCH_ROLES';
export const FETCH_ROLES_SUCCESS: string = 'FETCH_ROLES_SUCCESS';
export const FETCH_ROLES_FAILURE: string = 'FETCH_ROLES_FAILURE';

export const fetchRoles = () => {
	return {
		type: FETCH_ROLES,
	};
};

export const fetchRolesSuccess = (data: any) => {
	return {
		type: FETCH_ROLES_SUCCESS,
		payload: data,
	};
};

export const fetchRolesFailure = (failureMessage: string) => {
	return {
		type: FETCH_ROLES_FAILURE,
		payload: failureMessage,
	};
};
