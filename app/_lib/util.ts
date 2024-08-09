import moment from 'moment';
import { IRole, IUser } from '../interfaces';

export const getAccessToken = async () => {
	const res = await fetch('https://dev-x1bheham552up46h.us.auth0.com/oauth/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
			audience: `${process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}/`,
			client_secret: process.env.NEXT_PUBLIC_AUTH0_CLIENT_CREDENTIAL,
			grant_type: process.env.NEXT_PUBLIC_AUTH0_GRANT_TYPE,
		}),
	});
	const data = await res.json();
	// localStorage.setItem('auth0AccessToken', data.access_token);
	return data.access_token;
};

export const fetchRolesAsync = async (auth0AccessToken: string) => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}/roles`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `bearer ${auth0AccessToken}`,
		},
	});
	const data = await res.json();
	return data;
};

export const fetchUsersWithRoles = async (auth0AccessToken: string, tenantId: string) => {
	const users = await fetchUsersAsync(auth0AccessToken, tenantId);

	const usersWithRoles = await Promise.all(
		users.map(async (user: IUser) => {
			const roles = await fetchRoleByUserIdAsync(auth0AccessToken, user.user_id);
			const userMetadata = user.user_metadata || {};

			return {
				...user,
				user_metadata: {
					...userMetadata,
					roles: roles.map((role: IRole) => role.name).join(', '),
				},
			};
		}),
	);

	return usersWithRoles;
};

export const fetchRoleByUserIdAsync = async (auth0AccessToken: string, userId: string) => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}/users/${userId}/roles`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `bearer ${auth0AccessToken}`,
		},
	});
	const data = await res.json();
	return data;
};

export const fetchUsersAsync = async (auth0AccessToken: string, tenantId: string) => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}/users`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `bearer ${auth0AccessToken}`,
		},
	});
	const users = await res.json();
	const filteredUsers = users.filter(
		(user: any) => user.user_metadata && user.user_metadata.created_by_admin_id === tenantId,
	);
	return filteredUsers;
};

export const createRoleAsync = async (auth0AccessToken: string, roleName: string, roleDescription: string) => {
	await fetch(`${process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}/roles`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `bearer ${auth0AccessToken}`,
		},
		body: JSON.stringify({ name: roleName, description: roleDescription }),
	});
};

export const assignRoleAsync = async (auth0AccessToken: string, selectedRoleId: string, selectedUserId: string) => {
	await fetch(`${process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}/users/${selectedUserId}/roles`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `bearer ${auth0AccessToken}`,
		},
		body: JSON.stringify({ roles: [selectedRoleId] }),
	});
};

export const assignDefaultRoleToUser = async (auth0AccessToken: string, selectedUserId: string) => {
	const roles = await fetchRolesAsync(auth0AccessToken);
	const defaultRole = roles.find((role: IRole) => role.name === 'user');
	await fetch(`${process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}/roles/${defaultRole.id}/users`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `bearer ${auth0AccessToken}`,
		},
		body: JSON.stringify({ users: [selectedUserId] }),
	});
};

export const deleteUserAsync = async (auth0AccessToken: string, userId: string) => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}/users/${userId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `bearer ${auth0AccessToken}`,
		},
	});
	return;
};

export const saveUserAsync = async (auth0AccessToken: string, user: any) => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}/users`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `bearer ${auth0AccessToken}`,
		},
		body: JSON.stringify(user),
	});
	const data = await res.json();
	return data;
};

export const searchUserAsync = async (auth0AccessToken: string, queryString: string) => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}/users?q=${queryString}&search_engine=v3`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `bearer ${auth0AccessToken}`,
		},
	});
	const data = await res.json();
	return data;
};

export const searchUsersWithRoles = async (auth0AccessToken: string, queryString: string) => {
	const users = await searchUserAsync(auth0AccessToken, queryString);

	const usersWithRoles = await Promise.all(
		users.map(async (user: IUser) => {
			const roles = await fetchRoleByUserIdAsync(auth0AccessToken, user.user_id);
			const userMetadata = user.user_metadata || {};

			return {
				...user,
				user_metadata: {
					...userMetadata,
					roles: roles.map((role: IRole) => role.name).join(', '),
				},
			};
		}),
	);

	return usersWithRoles;
};

export const formattedDate = (dateString: string): string => {
	return moment(dateString).format('DD MMM YYYY, h:mm a');
};
