'use client';
import { 
    UserContext, 
    useUser, 
    withPageAuthRequired 
} from "@auth0/nextjs-auth0/client";
import LogoutIcon from '@mui/icons-material/Logout';
import { Grid } from '@mui/material';
import { NextFont } from 'next/dist/compiled/@next/font';
import { Inter } from "next/font/google";
import Link from 'next/link';
import { 
    useParams, 
    useRouter 
} from 'next/navigation';
import React, { ReactNode, useState } from 'react';
import { 
    HomePageConstants, 
    SideBarItems 
} from '.././constants';
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
    StyledSignOutSpan
} from './HomePage.style';
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const inter: NextFont = Inter({ subsets: ["latin"] });

const Layout = ({ children }: { children: ReactNode }) => {
    const loggedInUserData: UserContext = useUser();
    const [loggedInUserRole, setLoggedInUserRole] = useState<string>('');
    const [openIndexes, setOpenIndexes] = useState<any>({});

    const toggleOpen = (index: number) => {
        setOpenIndexes((prevState: any[]) => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };
    const param: Params = useParams();
    const router: AppRouterInstance = useRouter();

    React.useEffect(() => {
        handleTenantData();
    }, []);

    React.useEffect(() => {
        async function setRole() {
            const role: string | null = await localStorage.getItem('userRole');
            setLoggedInUserRole(role || '');
        }
        setRole();
    }, [])

    //supabase
    const getTenants = async (): Promise<any[]> => {
        let { data } = await supabase.from('tenant').select('*');
        return data || [];
    };
    const saveTenantInfo = async (tenant: any) => {
        await supabase.from('tenant').upsert([
            { ...tenant },
        ]);
    };
    const handleTenantData = async (): Promise<void> => {
        if (loggedInUserData.user) {
            const tenants = await getTenants();
            const isNewTenant: boolean = tenants.some((tenant) => tenant.tenant_id === loggedInUserData.user?.sub);
            if (!isNewTenant) {
                const tenant = {
                    tenant_id: loggedInUserData.user?.sub,
                    role: loggedInUserRole,
                    tenant_email: loggedInUserData.user?.email,
                    tenant_name: loggedInUserData.user?.name
                };
                await saveTenantInfo(tenant);
            }
        }
    };
    return (
        <Container className={inter.className}>
            <Sidebar>
                <StyledApplicationName>
                    {HomePageConstants.ADMIN_DASHBOARD}
                </StyledApplicationName>
                <StyledLinkContainer container direction={'column'} justifyContent={'space-between'}>
                    <Grid>
                        {SideBarItems.filter(item => item.roles.includes(loggedInUserRole)).map((sideBarItem, index) => (
                            <div key={index}>
                                <StyledLink onClick={() => toggleOpen(index)}>
                                    <Link href={`/${param.domain}/${sideBarItem.path}`}>
                                        {sideBarItem.icon}
                                        <span>{sideBarItem.itemName}</span>
                                    </Link>
                                </StyledLink>
                                {openIndexes[index] && sideBarItem.items && sideBarItem.items.length > 0 && (
                                    sideBarItem.items.map((child, childIndex) => (
                                        <StyledNestedLink key={`${index}-${childIndex}`}>
                                            <Link href={`/${param.domain}/${child.path}`} >
                                                <span>{child.itemName}</span>
                                            </Link>
                                        </StyledNestedLink>
                                    ))
                                )}
                            </div>
                        ))}
                    </Grid>
                    <Grid>
                        <StyledLink>
                            <LogoutIcon />
                            <StyledSignOutSpan onClick={() => router.push('/api/auth/logout')}>
                                {HomePageConstants.SIGN_OUT}
                            </StyledSignOutSpan>
                        </StyledLink>
                    </Grid>
                </StyledLinkContainer>
            </Sidebar>
            <ContentWrapper>
                <Header>
                    <StyledPageHeader>
                        {HomePageConstants.APPLICATION_NAME}
                    </StyledPageHeader>
                </Header>
                <Content>
                    {children}
                </Content>
            </ContentWrapper>
        </Container >
    )
};

export default withPageAuthRequired(Layout, {
    onRedirecting: () => <Loader />,
    onError: (error) => <div>{error.message}</div>,
    returnTo: '/'
});