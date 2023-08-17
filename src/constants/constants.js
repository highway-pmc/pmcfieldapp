export const HeaderItems = {
    dashboard: { showBack: false, title: 'Dashboard' },
    myWork: { showBack: false, title: 'My Work' },
    myWork2: { showBack: true, title: 'My Work 2' },
    myWork3: { showBack: true, title: 'My Work 3' },
    myTask: { showBack: true, title: 'My Task' },
    manageUsers: { showBack: false, title: 'Manage Users' },
    assignTask: { showBack: true, title: 'Assign Task' },
    flyoverDetails: { showBack: true, title: 'Flyover Details' },
    notifications: { showBack: false, title: 'Notifications' },
    progress: { showBack: false, title: 'Progress Dashboard' },
    reports: { showBack: false, title: 'Reports' },
    rfis: { showBack: false, title: 'RFIs' },
    profile: { showBack: false, title: 'Edit Profile' }
};

export const UserRoles = {
    "super-admin": "Super admin",
    "project-head": "Project Head",
    "structure-head": "Stucture Head",
    "highway-head": "Highway Head",
    "otherworks-head": "Other-Works Head",
    "category-users": "Category Head",
    "quality-head": "Quality Head",
    "quality-users": "Quality Users",
}

export const Dashboard_MENU = [
    {
        id: "1",
        icon: require("./../images/dashboard/my-work-icon.png"),
        iconMenu: require("./../images/menu/manage-icon.png"),
        title: "My Work",
        subTitle: "Check your task",
        route: 'MyWork',
        permissions: ["project-head", "structure-head", "highway-head", "otherworks-head"]
    },
    {
        id: "2",
        icon: require("./../images/dashboard/my-work-icon.png"),
        iconMenu: require("./../images/menu/mywork-icon.png"),
        title: "My Task",
        subTitle: "Check your task",
        route: 'MyTask',
        permissions: ["quality-head", "quality-users", "project-head"]
    },
    {
        id: "3",
        icon: require("./../images/dashboard/manage-user-icon.png"),
        iconMenu: require("./../images/menu/manage-icon.png"),
        title: "Manage User",
        subTitle: "Check user",
        route: 'ManageUsers',
        permissions: ["project-head", "structure-head", "highway-head", "otherworks-head", "quality-head"]
    },
    {
        id: "4",
        icon: require("./../images/dashboard/report-list-icon.png"),
        iconMenu: require("./../images/menu/report-menu-icon.png"),
        title: "Report",
        subTitle: "Report",
        route: 'Reports',
        permissions: ["project-head", "structure-head", "highway-head", "otherworks-head", "quality-head", "quality-users"]
    },
    {
        id: "5",
        icon: require("./../images/dashboard/progress-icon.png"),
        iconMenu: require("./../images/menu/progress-dash-icon.png"),
        title: "Progress Dashboard",
        subTitle: "Progress",
        route: 'Progress',
        permissions: ["project-head", "structure-head", "highway-head", "otherworks-head", "quality-head", "quality-users"]
    },
    {
        id: "6",
        icon: require("./../images/dashboard/manage-rfi-icon.png"),
        iconMenu: require("./../images/menu/manage-rfi-icom.png"),
        title: "Manage RFIs",
        subTitle: "RFI",
        route: 'RFIs',
        permissions: ["project-head", "structure-head", "highway-head", "otherworks-head", "quality-head", "quality-users"]
    }
];
