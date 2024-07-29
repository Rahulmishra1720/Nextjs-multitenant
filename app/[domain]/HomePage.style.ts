import styled from '@emotion/styled';
import { Grid } from '@mui/material';

export const Container = styled.div`
	display: flex;
	height: 100vh;
`;

export const Sidebar = styled('div')`
	width: 250px;
	background-color: #333;
	color: #fff;
	padding-left: 10px;
	display: flex;
	flex-direction: column;
	height: auto;
`;

export const Content = styled.div`
	flex: 1;
`;

export const ContentWrapper = styled.div`
	width: 100%;
	height: 100%;
	overflow: hidden;
`;

export const Header = styled.header`
	display: flex;
	background-color: #444;
	color: #fff;
	padding: 10px;
	text-align: start;
	& div {
		display: flex;
		flex: 1 1 auto;
		padding: 6px 0;
		justify-content: flex-start;
		align-content: center;
		flex-wrap: wrap;
		align-items: center;
		flex-direction: row;
	}
`;

export const Footer = styled.footer`
	background-color: #444;
	color: #fff;
	padding: 10px;
	text-align: center;
	position: fixed;
	bottom: 0;
	width: 100%;
`;

export const ToggleButton = styled.button`
	display: flex;
	background-color: #444;
	color: #fff;
	border: none;
	cursor: pointer;
	padding: 0 10px;
	& .MuiSvgIcon-root {
		font-size: 2rem;
	}
`;

export const StyledLink = styled('div')`
	padding: 20px 4px 0px 0px;
	display: flex;
	min-height: 40px;
	margin-bottom: 0.25rem;
	user-select: none;
	font-size: 1rem;
	align-items: center;
	color: rgb(223, 222, 222);
	& a {
		color: #fff;
		text-decoration: none;
		cursor: pointer;
	}

	& span {
		position: relative;
		bottom: 4px;
		padding-left: 6px;
	}
`;

export const StyledNestedLink = styled(StyledLink)`
	margin-left: 25px;
	padding-top: 5px;
`;

export const StyledLinkContainer = styled(Grid)`
	flex-wrap: nowrap;
	height: 100%;
	overflow: hidden auto;
`;

export const StyledApplicationName = styled('div')`
	font-size: 18px;
	padding-top: 10px;
`;

export const StyledPageHeader = styled('div')`
	flex: 1 1 auto;
	padding: 6px 0;
`;

export const StyledSignOutSpan = styled('span')`
	position: relative;
	bottom: 4px;
	top: 0;
	padding-left: 6px;
	cursor: pointer;
`;
