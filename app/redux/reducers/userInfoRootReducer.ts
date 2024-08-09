import { Action } from 'redux';
import {
	FETCH_USER_INFORMATION,
	FETCH_USER_INFORMATION_SUCCESS,
	FETCH_USER_INFORMATION_FAILURE,
	SAVE_USER_PREFERENCE,
} from '../actions';
import { IRole } from '../../interfaces';
import { IUserPreference } from '../interfaces';

export interface IUserInfo {
	loading: boolean;
	userRole: IRole[];
	userId: string;
	errorMessage: string;
	isNewUser: boolean | null;
	userPreference: IUserPreference | null;
}

const userState: IUserInfo = {
	loading: false,
	userRole: [],
	userId: '',
	errorMessage: '',
	isNewUser: null,
	userPreference: null,
};
interface IAction extends Action {
	payload: any;
}
const userInfoRootReducer = (state = userState, action: IAction) => {
	switch (action.type) {
		case FETCH_USER_INFORMATION:
			return {
				...state,
				loading: true,
			};
		case FETCH_USER_INFORMATION_SUCCESS:
			const { roles, isNewUser } = action.payload;
			return {
				...state,
				loading: false,
				userRole: roles,
				isNewUser: isNewUser,
			};
		case FETCH_USER_INFORMATION_FAILURE:
			return {
				...state,
				loading: false,
				errorMessage: action.payload,
				isNewUser: true,
			};
		case SAVE_USER_PREFERENCE:
			const { stackOverflowTags, githubLink } = action.payload;
			return {
				...state,
				userPreference: {
					stackOverflowTags,
					githubLink,
				},
			};
		default:
			return state;
	}
};

export default userInfoRootReducer;
