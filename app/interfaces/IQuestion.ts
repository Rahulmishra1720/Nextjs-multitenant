export interface IQuestion {
	is_answered: boolean;
	view_count: number;
	accepted_answer_id: number;
	answer_count: number;
	score: number;
	last_edit_date: number;
	question_id: number;
	link: string;
	title: string;
	body: string;
}
