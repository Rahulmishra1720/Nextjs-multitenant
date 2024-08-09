import { IQuestion, ISackOverflowSearchResponse } from '../interfaces';
import { IAnswer } from '../interfaces';

const getQuestionDetails = async (questionId: number): Promise<Array<IQuestion>> => {
	try {
		const url = `https://api.stackexchange.com/2.3/questions/${questionId}?order=desc&sort=activity&site=stackoverflow&filter=withbody`;
		const response = await fetch(url);
		const data = await response.json();
		return data.items;
	} catch (error) {
		console.error('Error fetching question details:', error);
		return [];
	}
};

const getAnswers = async (questionId: number): Promise<Array<IAnswer>> => {
	try {
		const url = `https://api.stackexchange.com/2.3/questions/${questionId}/answers?order=desc&sort=votes&site=stackoverflow&filter=withbody`;
		const response = await fetch(url);
		const data = await response.json();
		return data.items;
	} catch (error) {
		console.error('Error fetching answers:', error);
		return [];
	}
};

export const search = async (query: string): Promise<IAnswer | undefined> => {
	try {
		// Fetch content from stackOverlow
		const response = await fetch(`/api/stackoverflow?query=${encodeURIComponent(query)}`);
		const searchResults: ISackOverflowSearchResponse = await response.json();

		// Check if searchResults contains valid results
		if (
			!searchResults ||
			typeof searchResults !== 'object' ||
			Object.keys(searchResults).length === 0 ||
			searchResults.items.length === 0
		) {
			throw new Error('No search results found');
		}

		// Get the details and answers of the first search result
		const getMaxScoreQuestionId = (): number => {
			let maxScore = -Infinity;
			let questionIdWithMaxScore = 0;

			searchResults.items.forEach((item) => {
				if (item.score > maxScore) {
					maxScore = item.score;
					questionIdWithMaxScore = item.question_id;
				}
			});

			return questionIdWithMaxScore;
		};
		const questions: Array<IQuestion> = await getQuestionDetails(getMaxScoreQuestionId());
		const answers: Array<IAnswer> = await getAnswers(questions[0].question_id);
		if (questions.length == 0 || answers.length === 0) {
			throw new Error('No answers found for the question');
		}

		// Extract answer bodies
		const answerBodies = answers.map((answer) => answer.body);

		// Call Hugging Face Inference API
		const apiResponse = await fetch(
			'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					inputs: {
						source_sentence: query,
						sentences: answerBodies,
					},
				}),
			},
		);

		const apiResults = await apiResponse.json();

		// Handle potential errors from Hugging Face API
		if (apiResults.error) {
			console.error('Hugging Face API error:', apiResults.error);
			return;
		}

		// Ensure apiResults is an array and contains similarity scores
		if (!Array.isArray(apiResults) || apiResults.length === 0) {
			throw new Error('Invalid Hugging Face API results');
		}

		const maxScoreIndex: number = apiResults.indexOf(Math.max(...apiResults));
		const mostRelevantAnswer: IAnswer = answers[maxScoreIndex];

		return mostRelevantAnswer;
	} catch (error) {
		console.error('Error in search function:', error);
		return;
	}
};
