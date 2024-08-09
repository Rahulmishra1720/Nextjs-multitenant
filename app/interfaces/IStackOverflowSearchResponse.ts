interface IItem {
	is_answered: boolean;
	view_count: number;
	accepted_answer_id: number;
	answer_count: number;
	score: number;
	question_id: number;
	link: string;
	title: string;
}
export interface ISackOverflowSearchResponse {
	items: Array<IItem>;
}
