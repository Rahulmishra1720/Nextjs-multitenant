export const SAVE_USER_PREFERENCE: string = 'SAVE_USER_PREFERENCE';

export const saveUserPreference = (stackOverflowTags: string[], githubLink: string) => {
	return {
		type: SAVE_USER_PREFERENCE,
		payload: {
			stackOverflowTags,
			githubLink,
		},
	};
};
