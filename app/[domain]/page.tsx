import { Metadata } from 'next/types';
import { ReactNode } from 'react';

export const metadata: Metadata = {
	title: 'Dashboard',
};

export default function Page(children: ReactNode) {
	return <div>{children}</div>;
}
