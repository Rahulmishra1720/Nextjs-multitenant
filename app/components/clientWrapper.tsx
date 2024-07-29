'use client';
import * as React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function ClientWrapper({ children }: { children: React.ReactNode }): React.ReactElement {
	return <UserProvider>{children}</UserProvider>;
}
