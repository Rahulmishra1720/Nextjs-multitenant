'use client';
import React, { useState } from 'react';
import { Modal, TextField, Button, Autocomplete, Box, Grid, Paper } from '@mui/material';
import { IUserPreferenceModal } from '../interfaces';

const stackOverflowTags: string[] = [
	'javascript',
	'reactjs',
	'next.js',
	'node.js',
	'css',
	'html',
	'python',
	'java',
	'c++',
	'angular',
];

const UserPreferenceModal = ({ open, onClose, onSubmit }: IUserPreferenceModal): React.ReactElement => {
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [githubForum, setGithubForum] = useState<string>('');

	const handleTagChange = (_event: React.SyntheticEvent, value: string[]): void => {
		setSelectedTags(value);
	};

	const handleSubmit = (): void => {
		onSubmit(selectedTags, githubForum);
	};

	return (
		<Modal open={open} onClose={onClose}>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
					padding: 2,
				}}
			>
				<Paper sx={{ padding: 4, width: '100%', maxWidth: 600 }}>
					<h2>{'Provide Your Preferences'}</h2>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Autocomplete
								multiple
								freeSolo
								options={stackOverflowTags}
								value={selectedTags}
								onChange={handleTagChange}
								renderInput={(params) => (
									<TextField {...params} label="Stack Overflow Tags" placeholder="Select or add tags" />
								)}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label="GitHub Discussion Forum Link"
								value={githubForum}
								onChange={(e) => setGithubForum(e.target.value)}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
							<Button variant="outlined" onClick={onClose}>
								{'Cancel'}
							</Button>
							<Button variant="contained" color="primary" onClick={handleSubmit}>
								{'Submit'}
							</Button>
						</Grid>
					</Grid>
				</Paper>
			</Box>
		</Modal>
	);
};

export default UserPreferenceModal;
