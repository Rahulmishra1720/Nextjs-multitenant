import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { HomePageConstants } from "./HomePageConstants";
import SearchIcon from '@mui/icons-material/Search';
interface IItems {
    itemName: string;
    path: string;
}
interface ISideBarItems {
    itemName: string;
    path: string;
    icon: React.JSX.Element;
    roles: Array<string>;
    items: Array<IItems>;
};

const {
    ADMIN,
    ADMIN_PATH,
    SEARCH,
    SEARCH_PATH
} = HomePageConstants;

export const SideBarItems: Array<ISideBarItems> = [
    {
        itemName: ADMIN,
        path: ADMIN_PATH,
        icon: <AdminPanelSettingsIcon />,
        roles: ['Admin'],
        items: []
    },
    {
        itemName: SEARCH,
        path: SEARCH_PATH,
        icon: <SearchIcon />,
        roles: ['Admin', 'user'],
        items: []
    }
];