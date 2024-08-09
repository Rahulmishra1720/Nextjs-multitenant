'use client';
import * as React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Provider } from 'react-redux';
import store from '../store/store';

export default function ClientWrapper({ children }: { children: React.ReactNode }): React.ReactElement {
	return (
		<Provider store={store}>
			<UserProvider>{children}</UserProvider>
		</Provider>
	);
}
