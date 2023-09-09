export const HeaderItems = {
    dashboard: { showBack: false, title: 'Dashboard' },
    myWork: { showBack: false, title: 'My Work' },
    myWork2: { showBack: true, title: 'My Work 2' },
    myWork3: { showBack: true, title: 'My Work 3' },
    myTask: { showBack: false, title: 'My Task' },
    manageUsers: { showBack: false, title: 'Manage Users' },
    assignTask: { showBack: true, title: 'Assign Task' },
    flyoverDetails: { showBack: true, title: 'Flyover Details' },
    notifications: { showBack: false, title: 'Notifications' },
    progress: { showBack: false, title: 'Progress Dashboard' },
    reports: { showBack: false, title: 'Reports' },
    rfis: { showBack: false, title: 'RFIs' },
    projectInfo: { showBack: false, title: 'Project Info' },
    myTest: { showBack: false, title: 'My Test' },
    profile: { showBack: false, title: 'Edit Profile' }
};

export const UserRoles = {
    "super-admin": "Super admin",
    "project-head": "Project Head",
    "structure-head": "Stucture Head",
    "highway-head": "Highway Head",
    "other-work-head": "Other-Work Head",
    "quality-head": "Quality Head",
    "quality-users": "Quality Users",
    "user": "Normal User",
}

export const Dashboard_MENU = [
    {
        id: "1",
        icon: require("./../images/dashboard/my-work-icon.png"),
        iconMenu: require("./../images/menu/manage-icon.png"),
        title: "My Work",
        subTitle: "Check your task",
        route: 'MyWork',
        permissions: ["project-head", "structure-head", "highway-head", "other-work-head"]
    },
    {
        id: "2",
        icon: require("./../images/dashboard/my-work-icon.png"),
        iconMenu: require("./../images/menu/mywork-icon.png"),
        title: "My Test",
        subTitle: "My Test",
        route: 'MyTest',
        permissions: ["project-head", "quality-head"]
    },
    {
        id: "3",
        icon: require("./../images/dashboard/my-work-icon.png"),
        iconMenu: require("./../images/menu/mywork-icon.png"),
        title: "My Task",
        subTitle: "Check your task",
        route: 'MyTask',
        permissions: []
    },
    {
        id: "4",
        icon: require("./../images/dashboard/manage-user-icon.png"),
        iconMenu: require("./../images/menu/manage-icon.png"),
        title: "Manage User",
        subTitle: "Check user",
        route: 'ManageUsers',
        permissions: ["project-head", "structure-head", "highway-head", "other-work-head", "quality-head"]
    },
    {
        id: "5",
        icon: require("./../images/dashboard/manage-rfi-icon.png"),
        iconMenu: require("./../images/menu/manage-rfi-icom.png"),
        title: "Manage RFIs",
        subTitle: "RFI",
        route: 'RFIs',
        permissions: ["project-head", "structure-head", "highway-head", "other-work-head", "quality-head"]
    },
    {
        id: "6",
        icon: require("./../images/dashboard/my-work-icon.png"),
        iconMenu: require("./../images/menu/mywork-icon.png"),
        title: "Project Info",
        subTitle: "Project Info",
        route: 'ProjectInfo',
        permissions: ["project-head", "structure-head", "highway-head", "other-work-head", "quality-head", "user"]
    },
    {
        id: "7",
        icon: require("./../images/dashboard/progress-icon.png"),
        iconMenu: require("./../images/menu/progress-dash-icon.png"),
        title: "Progress Dashboard",
        subTitle: "Progress",
        route: 'Progress',
        permissions: ["project-head", "structure-head", "highway-head", "other-work-head", "quality-head", "user"]
    },
    {
        id: "8",
        icon: require("./../images/dashboard/report-list-icon.png"),
        iconMenu: require("./../images/menu/report-menu-icon.png"),
        title: "Report",
        subTitle: "Report",
        route: 'Reports',
        permissions: ["project-head", "structure-head", "highway-head", "other-work-head", "quality-head", "user"]
    },
];

export const MARITALSTATUS = {
    SINGLE: 'single',
    MARRIED: 'married',
    DIVORCED: 'divorced',
};

export const GENDER = {
    MALE: 'male',
    FEMALE: 'female',
    TRANS: 'trans',
};

export const LANGUAGE = {
    HINDI: 'hindi',
    ENGLISH: 'english',
    OTHER: 'other',
};

export const NATIONALITY = {
    INDIAN: 'indian',
    NRI: 'nri',
    FOREIGNER: 'foreigner',
};

export const BLOODGROUP = {
    'A+': 'A+',
    'O+': 'O+',
    'B+': 'B+',
    'AB+': 'AB+',
    'A-': 'A-',
    'O-': 'O-',
    'B-': 'B-',
    'AB-': 'AB-',
};
