import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const query: string | null = searchParams.get('query');

	if (!query) {
		return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
	}

	try {
		const url: string = `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${encodeURIComponent(query)}&site=stackoverflow`;
		const response = await fetch(url);
		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error('Error fetching content:', error);
		return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
	}
}
