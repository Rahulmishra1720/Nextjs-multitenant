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
	localStorage.setItem('auth0AccessToken', data.access_token);
	return data.access_token;
};
