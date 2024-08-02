'use client';
import * as React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import LoginButton from './components/login/LoginButton';
import Loader from './components/Loader';
import { assignDefaultRoleToUser, fetchRoleByUserIdAsync, getAccessToken } from './_lib/util';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { IRole } from './interfaces';

const Page = ({ children }: { children: React.ReactNode }): React.ReactElement => {
	const { user } = useUser();
	const router: AppRouterInstance = useRouter();

	React.useEffect(() => {
		const redirectUserBasedOnRole = async (): Promise<void> => {
			if (user && user.sub) {
				try {
					const token: string = await getAccessToken();
					const roles: Array<IRole> = await fetchRoleByUserIdAsync(token, user.sub);
					if (roles && roles.length > 0 && roles[0].name === 'Admin') {
						await localStorage.setItem('userRole', roles[0].name);
						await router.push('/query-bud/admin');
					} else if (roles.length === 0) {
						await assignDefaultRoleToUser(token, user.sub);
						await localStorage.setItem('userRole', 'user');
						await router.push('/query-bud');
					} else {
						await localStorage.setItem('userRole', roles[0].name);
						await router.push('/query-bud');
					}
				} catch (error) {
					console.error('Error fetching user roles:', error);
					await router.push('/query-bud');
					// Handle error or redirect to an error page
				}
			}
		};

		if (user && user.sub) {
			redirectUserBasedOnRole();
		}
	}, [user]);

	if (!user) {
		return <LoginButton />;
	}
	return <Loader />;
};
export default Page;
