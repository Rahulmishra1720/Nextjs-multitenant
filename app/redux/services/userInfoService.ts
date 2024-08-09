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

export const fetchUserAsync = async (auth0AccessToken: string, userId: string) => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}/users/${userId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `bearer ${auth0AccessToken}`,
		},
	});
	const users = await res.json();
	return users;
};
