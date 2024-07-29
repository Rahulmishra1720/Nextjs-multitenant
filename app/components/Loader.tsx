import { CircularProgress, Grid } from '@mui/material';
import React from 'react';

const Loader = (): React.ReactElement => {
	return (
		<Grid
			style={{ height: '100vh' }}
			container
			direction={'column'}
			justifyContent={'center'}
			alignItems={'center'}
			alignContent={'center'}
		>
			<CircularProgress />
		</Grid>
	);
};

export default Loader;
