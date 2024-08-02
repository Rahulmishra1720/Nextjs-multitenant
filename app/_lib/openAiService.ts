import { ISearchQueryResponse } from '../interfaces';

export const search = async (query: string): Promise<ISearchQueryResponse | undefined> => {
	try {
		// Fetch content from Wikipedia
		const response = await fetch(`/api/fetchWikipedia?query=${encodeURIComponent(query)}`);
		const wikipediaData: Array<ISearchQueryResponse> = await response.json();

		// Check if wikipediaData contains valid results
		if (!wikipediaData || typeof wikipediaData !== 'object' || Object.keys(wikipediaData).length === 0) {
			throw new Error('Invalid Wikipedia data');
		}

		// Extract sentences from wikipediaData
		const sentences: Array<string> = Object.values(wikipediaData).map((doc: any) => doc.extract);

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
						sentences: sentences,
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

		// Find the index of the highest similarity score
		const maxSimilarityIndex: number = apiResults.reduce(
			(maxIndex, score, index, array) => (score > array[maxIndex] ? index : maxIndex),
			0,
		);

		// Get the corresponding Wikipedia document
		const relevantDocument: ISearchQueryResponse = Object.values(wikipediaData)[maxSimilarityIndex];

		return relevantDocument;
	} catch (error) {
		console.error('Error in search function:', error);
		return;
	}
};
