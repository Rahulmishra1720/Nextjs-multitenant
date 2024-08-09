'use client';
import * as React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import Loader from './components/Loader';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { getUserInfo, saveUserPreference } from './redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { IUserInfo } from './redux/reducers';
import { IUserState } from './redux/interfaces';
import UserPreferenceModal from './components/UserPreferenceModal';
import { IRole } from './interfaces';

const Page = (): React.ReactElement => {
	const { user, isLoading } = useUser();
	const router: AppRouterInstance = useRouter();

	const dispatch = useDispatch();
	const roles: IRole[] = useSelector((state: IUserState) => (state.user as IUserInfo).userRole);
	const isNewUser: boolean | null = useSelector((state: IUserState) => (state.user as IUserInfo).isNewUser);
	const isUserDataLoading: boolean = useSelector((state: IUserState) => (state.user as IUserInfo).loading);

	const [shouldRedirectUser, setShouldRedirectUser] = React.useState<boolean>(false);
	const [isUserPreferenceModalOpen, setIsUserPreferenceModalOpen] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (isLoading) {
			return;
		}
		if (user && user.sub) {
			dispatch(getUserInfo(user?.sub));
		} else {
			window.location.assign('/api/auth/login');
		}
	}, [user, isLoading]);

	React.useEffect(() => {
		if (roles.length === 0) {
			return;
		}
		if (shouldRedirectUser) {
			const isAdmin: IRole = roles.find((role: IRole) => role.name === 'Super Admin' || role.name === 'Admin')!;
			if (isAdmin) {
				router.push('/query-bud/admin');
			} else {
				router.push('/query-bud/search');
			}
		}
	}, [roles, shouldRedirectUser]);

	React.useEffect(() => {
		if (isUserDataLoading || isNewUser === null) {
			return;
		}
		if (isNewUser) {
			setIsUserPreferenceModalOpen(true);
		} else {
			setShouldRedirectUser(true);
		}
	}, [isNewUser, isUserDataLoading]);

	const handleOnSubmit = (stackOverflowTags: string[], githubLink: string): void => {
		setIsUserPreferenceModalOpen(true);
		setShouldRedirectUser(true);
		dispatch(saveUserPreference(stackOverflowTags, githubLink));
	};

	if (isUserPreferenceModalOpen) {
		return (
			<UserPreferenceModal
				open={isUserPreferenceModalOpen}
				onSubmit={handleOnSubmit}
				onClose={() => {
					setIsUserPreferenceModalOpen(false);
				}}
			/>
		);
	}

	return <Loader />;
};
export default Page;
