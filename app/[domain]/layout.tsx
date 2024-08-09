'use client';
import { UserContext, useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import LogoutIcon from '@mui/icons-material/Logout';
import { Grid } from '@mui/material';
import { NextFont } from 'next/dist/compiled/@next/font';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { ReactNode, useState } from 'react';
import { HomePageConstants, pageMap, SideBarItems } from '.././constants';
import Loader from '../components/Loader';
import { supabase } from '../supabase';
import {
	Container,
	Content,
	ContentWrapper,
	Header,
	Sidebar,
	StyledApplicationName,
	StyledLink,
	StyledLinkContainer,
	StyledNestedLink,
	StyledPageHeader,
} from './HomePage.style';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { IRole, ITenant } from '../interfaces';
import { useSelector } from 'react-redux';
import { IUserState } from '../redux/interfaces';
import { IUserInfo } from '../redux/reducers';

const inter: NextFont = Inter({ subsets: ['latin'] });

const Layout = ({ children }: { children: ReactNode }) => {
	const loggedInUserData: UserContext = useUser();
	const [openIndexes, setOpenIndexes] = useState<any>({});
	const roles: IRole[] = useSelector((state: IUserState) => (state.user as IUserInfo).userRole);

	const toggleOpen = (index: number): void => {
		setOpenIndexes((prevState: any) => ({
			...prevState,
			[index]: !prevState[index],
		}));
	};
	const param: Params = useParams();
	const pathName: string = usePathname();
	const page: string = pathName.split('/')[2];

	const router: AppRouterInstance = useRouter();

	React.useEffect(() => {
		handleTenantData();
	}, []);

	React.useEffect(() => {
		if (roles.length === 0) {
			router.replace('/');
		}
	}, [roles]);

	//supabase
	const getTenants = async (): Promise<Array<ITenant>> => {
		let { data } = await supabase.from('tenant').select('*');
		return data || [];
	};
	const saveTenantInfo = async (tenant: ITenant) => {
		await supabase.from('tenant').upsert([{ ...tenant }]);
	};
	const handleTenantData = async (): Promise<void> => {
		if (loggedInUserData.user) {
			const tenants: Array<ITenant> = await getTenants();
			const isNewTenant: boolean = tenants.some((tenant) => tenant.tenant_id === loggedInUserData.user?.sub);
			if (!isNewTenant) {
				const tenant: ITenant = {
					tenant_id: loggedInUserData.user?.sub,
					role: roles.join(','),
					tenant_email: loggedInUserData.user?.email,
					tenant_name: loggedInUserData.user?.name,
				};
				await saveTenantInfo(tenant);
			}
		}
	};

	return (
		<Container className={inter.className}>
			<Sidebar>
				<StyledApplicationName>{HomePageConstants.APPLICATION_TITLE}</StyledApplicationName>
				<StyledLinkContainer container direction={'column'} justifyContent={'space-between'}>
					<Grid>
						{SideBarItems.filter((item) => roles.some((role) => item.roles.includes(role.name))).map(
							(sideBarItem, index) => (
								<div key={index}>
									<StyledLink onClick={() => toggleOpen(index)}>
										<Link href={`/${param.domain}/${sideBarItem.path}`}>
											{sideBarItem.icon}
											<span>{sideBarItem.itemName}</span>
										</Link>
									</StyledLink>
									{openIndexes[index] &&
										sideBarItem.items &&
										sideBarItem.items.length > 0 &&
										sideBarItem.items.map((child, childIndex) => (
											<StyledNestedLink key={`${index}-${childIndex}`}>
												<Link href={`/${param.domain}/${child.path}`}>
													<span>{child.itemName}</span>
												</Link>
											</StyledNestedLink>
										))}
								</div>
							),
						)}
					</Grid>
					<Grid>
						<StyledLink>
							<LogoutIcon />
							<a href={'/api/auth/logout'}>{HomePageConstants.SIGN_OUT}</a>
						</StyledLink>
					</Grid>
				</StyledLinkContainer>
			</Sidebar>
			<ContentWrapper>
				<Header>
					<StyledPageHeader>{pageMap.get(page)}</StyledPageHeader>
				</Header>
				<Content>{children}</Content>
			</ContentWrapper>
		</Container>
	);
};

export default withPageAuthRequired(Layout, {
	onRedirecting: () => <Loader />,
	onError: (error) => <div>{error.message}</div>,
	returnTo: '/',
});
