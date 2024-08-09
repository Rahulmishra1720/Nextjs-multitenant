export interface IUserPreferenceModal {
	open: boolean;
	onClose: () => void;
	onSubmit: (stackOverflowTags: string[], githubForumLink: string) => void;
}
