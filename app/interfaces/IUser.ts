import { IRole } from './IRole';

export interface IUser {
	user_id: string;
	name: string;
	user_metadata: {
		roles: string;
	};
	last_login: string;
	created_at: string;
}
