'use client';
import * as React from 'react';
import { Container, Paper, Box, Skeleton, TextField, Button } from '@mui/material';
import { ChatMessageConstants } from '../constants';
import { search } from '../_lib/openAiService';
import { IMessage, ISearchQueryResponse } from '../interfaces';

const ChatMessage = (): React.ReactElement => {
	const [query, setQuery] = React.useState<string>('');
	const [messages, setMessages] = React.useState<Array<IMessage>>([]);
	const [loading, setLoading] = React.useState<boolean>(false);

	const handleSearch = async () => {
		setLoading(true);
		const result: ISearchQueryResponse | undefined = await search(query);
		if (result) {
			setMessages([...messages, { type: 'user', text: query }, { type: 'bot', text: result.extract }]);
		}
		setQuery('');
		setLoading(false);
	};

	return (
		<Container maxWidth="md">
			<Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
				<Box sx={{ height: '65vh', overflowY: 'auto', marginBottom: 2 }}>
					{messages.map((msg, index) => (
						<Box
							key={index}
							sx={{
								display: 'flex',
								justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
								marginY: 1,
							}}
						>
							<Box
								sx={{
									padding: 2,
									borderRadius: 1,
									backgroundColor: msg.type === 'user' ? 'primary.main' : 'grey.300',
									color: msg.type === 'user' ? 'white' : 'black',
								}}
							>
								{msg.text}
							</Box>
						</Box>
					))}
					{loading && (
						<Box sx={{ display: 'flex', justifyContent: 'flex-start', marginY: 1 }}>
							<Skeleton variant="rectangular" width="75%" height={24} />
						</Box>
					)}
				</Box>
				<Box sx={{ display: 'flex' }}>
					<TextField
						variant="outlined"
						fullWidth
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Ask a question..."
					/>
					<Button variant="contained" color="primary" onClick={handleSearch} sx={{ marginLeft: 2 }}>
						{ChatMessageConstants.SEND}
					</Button>
				</Box>
			</Paper>
		</Container>
	);
};

export default ChatMessage;
