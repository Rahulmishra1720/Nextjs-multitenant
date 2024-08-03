import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const query: string | null = searchParams.get('query');

	if (!query) {
		return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
	}

	try {
		const response = await fetch(
			`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&prop=extracts&exintro&explaintext&format=json`,
		);
		const data = await response.json();
		const pages = data.query.pages;

		return NextResponse.json(pages);
	} catch (error) {
		console.error('Error fetching Wikipedia content:', error);
		return NextResponse.json({ error: 'Failed to fetch Wikipedia content' }, { status: 500 });
	}
}
