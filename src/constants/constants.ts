export const HeaderItems = {
    dashboard: { showBack: false, title: 'Dashboard' },
    myWork: { showBack: false, title: 'My Work' },
    myWork2: { showBack: true, title: 'My Work 2' },
    myWork3: { showBack: true, title: 'My Work 3' },
    myTask: { showBack: true, title: 'My Task' },
    manageUsers: { showBack: false, title: 'Manage Users' },
    notifications: { showBack: false, title: 'Notifications' },
    progress: { showBack: false, title: 'Progress Dashboard' },
    reports: { showBack: false, title: 'Reports' },
    rfis: { showBack: false, title: 'RFIs' },
    profile: { showBack: false, title: 'Edit Profile' }
};

export const UserRoles: any = {
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
        title: "My Work",
        subTitle: "Check your task",
        route: 'MyWork',
        permissions: ["project-head", "structure-head", "highway-head", "otherworks-head", "category-users"]
    },
    {
        id: "1",
        icon: require("./../images/dashboard/my-work-icon.png"),
        title: "My Task",
        subTitle: "Check your task",
        route: 'MyTask',
        permissions: ["quality-head", "quality-users"]
    },
    {
        id: "2",
        icon: require("./../images/dashboard/manage-user-icon.png"),
        title: "Manage User",
        subTitle: "Check user",
        route: 'ManageUsers',
        permissions: ["project-head", "structure-head", "highway-head", "otherworks-head", "quality-head"]
    },
    {
        id: "3",
        icon: require("./../images/dashboard/report-list-icon.png"),
        title: "Report",
        subTitle: "Report",
        route: 'Reports',
        permissions: ["project-head", "structure-head", "highway-head", "otherworks-head", "quality-head", "category-users", "quality-users"]
    },
    {
        id: "4",
        icon: require("./../images/dashboard/progress-icon.png"),
        title: "Progress Dashboard",
        subTitle: "Progress",
        route: 'Progress',
        permissions: ["project-head", "structure-head", "highway-head", "otherworks-head", "quality-head", "category-users", "quality-users"]
    },
    {
        id: "5",
        icon: require("./../images/dashboard/manage-rfi-icon.png"),
        title: "Manage RFIs",
        subTitle: "RFI",
        route: 'RFIs',
        permissions: ["project-head", "structure-head", "highway-head", "otherworks-head", "quality-head", "category-users", "quality-users"]
    }
];