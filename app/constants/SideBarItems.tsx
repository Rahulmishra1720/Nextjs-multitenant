import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { HomePageConstants } from "./HomePageConstants";

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
    EMPLOYEES,
    PAYROLL,
    REPORTS,
    EMPLOYEE_PATH,
    PAYROLL_PATH,
    REPORTS_PATH,
    ADMIN,
    ADMIN_PATH,
    TASK,
    TASK_PATH
} = HomePageConstants;

export const SideBarItems: Array<ISideBarItems> = [
    {
        itemName: EMPLOYEES,
        path: EMPLOYEE_PATH,
        icon: <BadgeRoundedIcon />,
        roles: ['user'],
        items: []
    },
    {
        itemName: PAYROLL,
        path: PAYROLL_PATH,
        icon: <PaidRoundedIcon />,
        roles: ['user'],
        items: []
    },
    {
        itemName: REPORTS,
        path: REPORTS_PATH,
        icon: <AssessmentRoundedIcon />,
        roles: ['user'],
        items: []
    },
    {
        itemName: ADMIN,
        path: ADMIN_PATH,
        icon: <AdminPanelSettingsIcon />,
        roles: ['Admin'],
        items: []
    },
    {
        itemName: TASK,
        path: TASK_PATH,
        icon: <AssignmentTurnedInIcon />,
        roles: ['user', 'Manager'],
        items: [{
            itemName: 'All Open',
            path: '/open'
        }, {
            itemName: 'Completed',
            path: '/completed'
        }]
    }
];